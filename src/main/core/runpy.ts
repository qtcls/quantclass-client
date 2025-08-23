/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { exec } from "node:child_process"
import fs from "node:fs"
import { writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { arch } from "node:os"
import path from "node:path"
import { CONFIG } from "@/main/config.js"
import windowManager from "@/main/lib/WindowManager.js"
import { postUserMainAction } from "@/main/request/index.js"
import store from "@/main/store/index.js"
import { getBinPath } from "@/main/utils/common.js"
import { BASE_URL, CLIENT_VERSION } from "@/main/vars.js"
import { platform } from "@electron-toolkit/utils"
import dayjs from "dayjs"
import {
	checkDownloadLimit,
	checkLock,
	createLockFile,
	removeLockFile,
} from "../utils/tools.js"
import logger from "../utils/wiston.js"
import { getCoreVersion, getVersionWithLoop } from "./lib.js"

const require = createRequire(import.meta.url)
const AdmZip = require("adm-zip")

const clientVersion = CLIENT_VERSION

const URL = `${BASE_URL}/api/data/client`
const CORE_VERSION_REMOTE_URL = {
	fuel: `${URL}/fuel-bin-v2/version`,
	aqua: `${URL}/aqua-bin/version`,
	rocket: `${URL}/rocket-bin-v3/version`,
	zeus: `${URL}/zeus-bin/version`,
}

// -- 添加工具函数
function getRandomDelay(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min) * 1000
}

/**
 * 检查本地版本和远程版本是否一致
 * @returns {Promise<boolean>} 如果版本一致返回 true,否则返回 false
 */
export async function isCoreUpToDate(
	core: "fuel" | "aqua" | "rocket" | "zeus",
	immediately = true, //是否需要立即检查版本
): Promise<boolean | 1> {
	const binPath = await getBinPath(core)
	const isBinExist = fs.existsSync(binPath)

	// -- 如果本地不存在内核，直接返回 false
	if (!isBinExist) {
		logger.info(`[${core}] 本地不存在内核`)
		return false
	}

	const current = dayjs()
	const lastUpdateCheck = await store.getValue(`lastUpdateCheck.${core}`, "")

	// 如果immediately=true，表示需要立即检查版本，这个时候跳过时间检查，直接请求远程版本
	if (lastUpdateCheck) {
		// -- 如果存在内核，且需要检查时间
		const lastUpdateTime = dayjs(lastUpdateCheck)
		const timeDifference = current.diff(lastUpdateTime, "second")
		const randomDelay = immediately ? 3 : (getRandomDelay(41, 67) * 7) / 1000 // 转换为秒，每次休息间隔大概7分钟再check版本
		logger.info(`随机数 ${randomDelay}，timeDifference ${timeDifference}`)
		if (timeDifference < randomDelay) {
			logger.info(
				`[${core}] 距离上次检查时间不足 ${(randomDelay / 60).toFixed(1)} 分钟，跳过检查`,
			)
			return 1
		}
	}
	store.setValue(`lastUpdateCheck.${core}`, current.toISOString())

	try {
		const { version: remoteVersion } = await getRemoteVersion(core)
		const localVersion = await getCoreVersion(core)

		logger.info(
			`[${core}] 本地版本: ${localVersion}, 远程版本: ${remoteVersion}`,
		)

		return remoteVersion === localVersion
	} catch (error) {
		// -- 如果请求失败但本地有内核，返回 true
		logger.info(`[${core}] 远程版本获取失败，但本地存在内核，跳过更新`)
		logger.error(`[${core}] 检查版本一致性时出错: ${error}`)
		return true
	}
}

// 这个函数是给客户端页面检查内核是否最新使用，所以 默认immediate === true 表示立即检查，跳过延迟
export async function isFuelUpToDate(): Promise<boolean | 1> {
	return isCoreUpToDate("fuel")
}

export async function isAquaUpToDate(): Promise<boolean | 1> {
	return isCoreUpToDate("aqua")
}

export async function isRocketUpToDate(): Promise<boolean | 1> {
	return isCoreUpToDate("rocket")
}

/**
 * 检查服务器内核版本
 * @returns {Promise<{version: string, download: string}>}
 * @throws Error
 */
export async function getRemoteVersion(
	core: "fuel" | "aqua" | "rocket" | "zeus",
): Promise<{
	version: string
	download: string
	downloads?: {
		win: string
		arm: string
		intel: string
	}
}> {
	const response = await fetch(
		`${CORE_VERSION_REMOTE_URL[core]}?client=${clientVersion}`,
	)

	if (!response.ok)
		throw new Error(`[${core}] 内核版本获取失败: ${response.status}`)

	const data = await response.json()

	if (data.code === 200) {
		return data.data
	}

	throw new Error(`[${core}] 内核版本获取失败: ${response.status}`)
}

/**
 * 下载内核，从2025年5月27日开始，所有内核采用onedir的打包方式，所以需要替换exe为zip
 * @param core 内核名称
 * @returns
 */
export async function downloadCore(core: "aqua" | "rocket" | "zeus") {
	const lockFileName =
		CONFIG[`UPDATE_${core.toUpperCase()}_LOCK_FILE_NAME`] ??
		CONFIG.LOCK_FILE_NAME

	if (await checkLock(lockFileName)) {
		logger.info(`[${core}] 正在下载中，退出`)
		return
	}

	logger.info(`[${core}] 更新开始...`)
	await createLockFile(lockFileName)

	try {
		const { version, download } = await getRemoteVersion(core)
		const binFolder = await store.getAllDataPath(["code"])

		if (!download) {
			logger.error(`[${core}] 下载链接为空`)
			return
		}

		// 2025年5月27日开始，所有内核采用onedir的打包方式，所以需要替换exe为zip
		let downloadUrl = download
		downloadUrl = download.replace(".exe", ".zip")

		logger.info(
			`[${core}] 使用远程链接: ${downloadUrl.replace("https://cdnservice.quantclass.cn/client", "")}`,
		)
		logger.info(`[${core}] 内核保存路径: ${binFolder}`)

		const fileName = downloadUrl.split("/").pop() as string
		const versionFileName = path.join(binFolder, `${version}.yml`)
		const binPath = path.join(binFolder, fileName)

		// -- 检查文件写入权限
		try {
			// -- 删除对应内核的旧版本 yml 文件
			const prefix = core.toLowerCase()
			const oldVersionFiles = await fs.promises
				.readdir(binFolder)
				.then((files) =>
					files.filter(
						(file) => file.startsWith(`${prefix}_`) && file.endsWith(".yml"),
					),
				)
			for (const file of oldVersionFiles) {
				await fs.promises.unlink(path.join(binFolder, file))
				logger.info(`[${core}] 删除旧的内核版本文件: ${file}`)
			}

			// -- 测试文件写入权限
			await writeFile(versionFileName, version)
			await fs.promises.unlink(versionFileName)
		} catch (error) {
			const mainWindow = windowManager.getWindow()

			logger.error(`[${core}] 文件系统权限错误: ${error}`)
			mainWindow?.webContents.send("report-msg", {
				code: 400,
				message: `文件系统权限错误，内核下载失败: ${error}`,
			})
			return
		}

		// -- 检查下载次数限制
		const canDownload = await checkDownloadLimit(core.toLowerCase())
		if (!canDownload) {
			logger.warn(`[${core}] 内核今日下载次数已达上限`)
			return
		}

		// -- 开始下载
		const res = await fetch(downloadUrl)
		if (!res.ok) {
			logger.error(`[${core}] 获取内核失败: ${res.status}`)
			throw new Error(`获取 ${core} Core 失败: ${res.status}`)
		}

		const buffer = Buffer.from(await res.arrayBuffer())

		await Promise.all([
			writeFile(versionFileName, version),
			writeFile(binPath, buffer),
		])

		// -- 下载成功后发送埋点请求
		try {
			const api_key = await store.getSetting("api_key", "")
			const uuid = await store.getSetting("hid", "")
			if (api_key && uuid) {
				await postUserMainAction(api_key, {
					uuid,
					role: "client",
					action: `下载 ${core} 内核成功: ${version}`,
				})
			}
		} catch (error) {
			logger.error(`[${core}] 请求点失败: ${error}`)
		}

		logger.info(`[${core}] 内核文件已下载到 ${binPath}`)

		// 解压zip文件，从2025年5月27日开始，所有内核采用onedir的打包方式，所以需要解压zip文件
		const zip = new AdmZip(binPath)
		zip.extractAllTo(binFolder, true)
		await fs.promises.unlink(binPath) // 删除zip文件
	} catch (error) {
		logger.error(`[${core}] 更新/下载内核失败: ${error}`)
	} finally {
		await removeLockFile(lockFileName)
	}
}

export async function updateCore(
	core: "aqua" | "rocket" | "zeus",
	check_immediately = false,
) {
	// -- 非Windows系统，跳过更新
	if (!platform.isWindows) {
		logger.info(`[${core}] 非Windows系统，跳过更新`)
		return
	}

	const isUpToDate = await isCoreUpToDate(core, check_immediately)
	if (isUpToDate === 1) return // -- undefined 表示跳过本次更新检查

	if (isUpToDate) {
		logger.info(`[${core}] 与远程版本一致`)
		return
	}

	await downloadCore(core)
}

/**
 * 下载并且更新 Fuel 内核
 * @returns {Promise<void>}
 */
export async function updateFuelCore(
	immediately = false,
): Promise<{ msg: string }> {
	// 检查版本一致性
	const isUpToDate = await isCoreUpToDate("fuel", immediately)
	if (isUpToDate === 1) {
		return { msg: "Fuel 已是最新" }
	}
	if (isUpToDate) {
		logger.info("[fuel] 与远程版本一致")
		return { msg: "Fuel 已是最新" }
	}
	// 设置更新锁
	const isFuelUpdating = await checkLock(CONFIG.UPDATE_FUEL_LOCK_FILE_NAME)

	if (isFuelUpdating) {
		logger.info("[fuel] 内核正在下载中，退出")
		return { msg: "Fuel 正在下载中" }
	}

	logger.info("[fuel] 开始下载...")
	await createLockFile(CONFIG.UPDATE_FUEL_LOCK_FILE_NAME)

	try {
		// 设置环境变量
		const { version, downloads = { arm: "", win: "", intel: "" } } =
			await getRemoteVersion("fuel")
		let download_link = ""
		const py_code_path = await store.getAllDataPath(["code"])

		if (!fs.existsSync(py_code_path)) {
			try {
				fs.mkdirSync(py_code_path)
			} catch (error) {
				logger.error(`[fuel] 创建目录失败: ${error}`)
				return { msg: "创建目录失败" }
			}
		}

		if (platform.isMacOS) {
			if (arch() === "arm64") {
				download_link = downloads.arm
			} else if (arch() === "x64") {
				download_link = downloads.intel
			} else {
				logger.error(`[fuel] 不支持的 macOS 架构: ${arch()}`)

				return { msg: `不支持的 macOS 架构: ${arch()}` }
			}
		} else if (platform.isWindows) {
			// -- 2025年5月27日开始，所有内核采用onedir的打包方式，所以需要替换exe为zip
			download_link = downloads.win.replace(".exe", ".zip")
		} else {
			logger.error("[fuel] 不支持的操作系统")
			return { msg: "不支持的操作系统" }
		}

		if (!download_link) {
			logger.error("[fuel] 无法确定下载链接")
			return { msg: "无法确定下载链接" }
		}

		const fileName = download_link.split("/").pop() as string
		const versionFileName = path.join(py_code_path, `${version}.yml`)
		const remoteFuelBinName = path.join(py_code_path, fileName)

		// -- 检查文件写入权限
		try {
			// -- 删除对应内核的旧版本 yml 文件
			const oldVersionFiles = await fs.promises
				.readdir(py_code_path)
				.then((files) =>
					files.filter(
						(file) => file.startsWith("fuel_") && file.endsWith(".yml"),
					),
				)
			for (const file of oldVersionFiles) {
				await fs.promises.unlink(path.join(py_code_path, file))
				logger.info(`[fuel] 删除旧的版本文件: ${file}`)
			}

			// -- 测试文件写入权限
			await writeFile(versionFileName, version)
			await fs.promises.unlink(versionFileName)
		} catch (error) {
			const mainWindow = windowManager.getWindow()
			logger.error(`[fuel] 文件系统权限错误: ${error}`)
			mainWindow?.webContents.send("report-msg", {
				code: 400,
				message: `文件系统权限错误，Fuel 内核下载失败: ${error}`,
			})
			return { msg: "[fuel] 文件系统权限错误" }
		}

		logger.info(
			`[fuel] 内核保存路径: ${py_code_path}，下载链接: ${download_link}`,
		)

		// -- 检查下载次数限制
		const canDownload = await checkDownloadLimit("fuel")
		if (!canDownload) {
			return { msg: "[fuel] 今日下载次数已达上限" }
		}

		// -- 开始下载

		const res = await fetch(download_link)
		if (!res.ok) {
			logger.error(
				`[fuel] 获取 URL 失败: ${download_link.replace("https://cdnservice.quantclass.cn/client", "")}, 状态: ${res.status}`,
			)
			return { msg: `下载失败: ${res.statusText}` }
		}

		const buffer = Buffer.from(await res.arrayBuffer())

		await Promise.all([
			writeFile(versionFileName, version),
			writeFile(remoteFuelBinName, buffer),
		])

		// -- 下载成功后送埋点请求
		try {
			if (platform.isMacOS) {
				exec(`chmod +x ${remoteFuelBinName}`)
			}
			const api_key = await store.getSetting("api_key", "")
			const uuid = await store.getSetting("uuid", "")
			if (api_key && uuid) {
				await postUserMainAction(api_key, {
					uuid,
					role: "client",
					action: `下载 Fuel 内核成功: ${version}`,
				})
			}
		} catch (error) {
			logger.error(`[fuel] 请求点失败: ${JSON.stringify(error, null, 2)}`)
		}

		logger.info(`[fuel] 文件已下载到 ${remoteFuelBinName}`)

		if (platform.isWindows) {
			// -- 2025年5月27日开始，所有内核采用onedir的打包方式，所以需要解压zip文件
			const zip = new AdmZip(remoteFuelBinName)
			zip.extractAllTo(py_code_path, true)
			await fs.promises.unlink(remoteFuelBinName) // 删除zip文件
		}

		logger.info("[fuel] 已更新")
		return { msg: "Fuel 更新成功" }
	} catch (error) {
		logger.error(`[fuel] 更新失败: ${error}`)
		return { msg: "Fuel 更新失败" }
	} finally {
		// 解除更新锁
		await removeLockFile(CONFIG.UPDATE_FUEL_LOCK_FILE_NAME)
	}
}

// 当表单保存时，做一系列检查
export async function updatePyCore(isMember: boolean) {
	const mainWindow = windowManager.getWindow()
	// 让前端进入loading的状态
	mainWindow?.webContents.send("client-global-loading", true, "success")

	logger.info("更新内核")

	// 更新内核
	try {
		await updateFuelCore(true)
		if (platform.isWindows && isMember) {
			await updateCore("aqua", true)
			await updateCore("rocket", true)
			await updateCore("zeus", true)
		}
	} catch (e) {
		logger.error(JSON.stringify(e, null, 2))
		mainWindow?.webContents.send("client-global-loading", false, "error")
		// 在异常情况下，直接返回，不执行后续的操作
		return await getVersionWithLoop()
	}

	logger.info("内核更新执行完成")
	mainWindow?.webContents.send("client-global-loading", false, "success")

	return await getVersionWithLoop()
}
