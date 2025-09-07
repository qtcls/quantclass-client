/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import fs from "node:fs"
import { writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import type { AppVersions } from "@/shared/types/index.js"
import { CONFIG } from "@/main/config.js"
import windowManager from "@/main/lib/WindowManager.js"
import { postUserMainAction } from "@/main/request/index.js"
import store from "@/main/store/index.js"
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
import { getCoreAndClientVersions, getCoreVersion } from "./lib.js"

const require = createRequire(import.meta.url)
const AdmZip = require("adm-zip")

const clientVersion = CLIENT_VERSION

const URL = `${BASE_URL}/api/data/query/client-versions`

// -- 添加工具函数
function getRandomDelay(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min) * 1000
}

/**
 * 检查服务器内核版本，并且保存到本地
 * @returns {Promise<{version: string, download: string}>}
 * @throws Error
 */
export async function fetchRemoteVersions(): Promise<AppVersions> {
	console.log(`[version] fetch ${URL}?client=${clientVersion}`)
	const response = await fetch(`${URL}?client=${clientVersion}`)

	if (!response.ok)
		throw new Error(`[app] 内核版本获取失败: ${response.status}`)

	const resp = await response.json()

	store.setValue("app.versions", resp)
	return resp
}

/**
 * 获取本地缓存的远程版本，如果本地没有缓存，则重新请求远程版本
 * @returns {Promise<AppVersions>}
 */
export async function getRemoteVersions(): Promise<AppVersions> {
	const versions = (await store.getValue("app.versions", {})) as AppVersions
	if (!versions.latest) {
		return await fetchRemoteVersions()
	}
	return versions
}

/**
 * 检查本地版本和远程版本是否一致
 * @returns {Promise<boolean>} 如果版本一致返回 true,否则返回 false
 */
export async function checkRemoteVersions(now = true): Promise<AppVersions> {
	const current = dayjs()
	const lastUpdateCheck = await store.getValue("lastUpdateCheck.app", "")
	let remoteVersions = await getRemoteVersions()
	let needFetchRemoteVersion = true

	// 如果immediately=true，表示需要立即检查版本，这个时候跳过时间检查，直接请求远程版本
	if (lastUpdateCheck) {
		// -- 如果存在内核，且需要检查时间
		const lastUpdateTime = dayjs(lastUpdateCheck)
		const timeDifference = current.diff(lastUpdateTime, "second")
		const randomDelay = now ? 3 : (getRandomDelay(41, 67) * 7) / 1000 // 转换为秒，每次休息间隔大概7分钟再check版本
		logger.info(`随机数 ${randomDelay}，timeDifference ${timeDifference}`)
		if (timeDifference < randomDelay) {
			logger.info(
				`[远程版本检查] 距离上次检查时间不足 ${(randomDelay / 60).toFixed(1)} 分钟，跳过检查`,
			)
			needFetchRemoteVersion = false
		}
	}

	if (needFetchRemoteVersion) {
		remoteVersions = await fetchRemoteVersions()
	}
	store.setValue("lastUpdateCheck.app", current.toISOString())

	return remoteVersions
}

/**
 * 下载内核，从2025年5月27日开始，所有内核采用onedir的打包方式，所以需要替换exe为zip
 * @param core 内核名称
 * @returns
 */
export async function downloadCore(
	core: "fuel" | "aqua" | "rocket" | "zeus",
	version: string,
	downloadUrl: string,
) {
	const lockFileName = `update_${core.toLowerCase()}.app.lock`

	if (await checkLock(lockFileName)) {
		logger.info(`[${core}] 正在下载中，退出`)
		return
	}

	logger.info(`[${core}] 更新开始...`)
	await createLockFile(lockFileName)
	const mainWindow = windowManager.getWindow()

	try {
		const codeFolder = await store.getAllDataPath(["code"])

		if (!downloadUrl) {
			logger.error(`[${core}] 下载链接为空`)
			return
		}

		logger.info(
			`[${core}] 版本: ${version}，使用远程链接: ${downloadUrl}，保存路径: ${codeFolder}`,
		)

		const fileName = downloadUrl.split("/").pop() as string
		const versionFileName = path.join(codeFolder, `${version}.yml`)
		const coreZipPath = path.join(codeFolder, fileName)

		// -- 检查文件写入权限
		try {
			// -- 删除对应内核的旧版本 yml 文件
			const prefix = core.toLowerCase()
			const oldVersionFiles = await fs.promises
				.readdir(codeFolder)
				.then((files) =>
					files.filter(
						(file) => file.startsWith(`${prefix}_`) && file.endsWith(".yml"),
					),
				)
			for (const file of oldVersionFiles) {
				await fs.promises.unlink(path.join(codeFolder, file))
				logger.info(`[${core}] 删除旧的内核版本文件: ${file}`)
			}

			// -- 测试文件写入权限
			await writeFile(versionFileName, version)
			await fs.promises.unlink(versionFileName)
		} catch (error) {
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
			mainWindow?.webContents.send("report-msg", {
				code: 400,
				message: "今日内核下载次数已达上限，请联系助教再试",
			})
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
			writeFile(coreZipPath, buffer),
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

		logger.info(`[${core}] 内核文件已下载到 ${coreZipPath}`)

		// 解压zip文件，从2025年5月27日开始，所有内核采用onedir的打包方式，所以需要解压zip文件
		const zip = new AdmZip(coreZipPath)
		zip.extractAllTo(codeFolder, true)
		await fs.promises.unlink(coreZipPath) // 删除zip文件

		logger.info(`[${core}] 内核文件已解压到 ${codeFolder}`)
	} catch (error) {
		logger.error(`[${core}] 更新/下载内核失败: ${error}`)
	} finally {
		await removeLockFile(lockFileName)
	}
}

export async function updateCore(
	core: "aqua" | "rocket" | "zeus" | "fuel",
	now = false,
	targetVersion?: string,
) {
	const windows_cores = ["rocket"]
	// -- 如果需要立即检查版本，并且没有指定版本，则立即检查版本
	const remoteVersions = await checkRemoteVersions(now && !targetVersion)
	const localVersion = await getCoreVersion(core)

	let downloadVersion = ""
	let downloadUrl = ""

	// -- 非Windows系统，跳过更新
	if (!platform.isWindows && windows_cores.includes(core)) {
		logger.info(`[${core}] 非Windows系统，跳过更新`)
		return
	}

	if (targetVersion) {
		if (localVersion === targetVersion) {
			logger.info(`[${core}] 版本一致，跳过更新`)
			return
		}
		downloadVersion = targetVersion
		downloadUrl = remoteVersions.downloads[core].replace(
			`${remoteVersions.latest[core]}`,
			targetVersion,
		)
	} else {
		if (remoteVersions.latest[core] === localVersion) {
			logger.info(`[${core}] 与远程版本一致`)
			return
		}
		downloadVersion = remoteVersions.latest[core]
		downloadUrl = remoteVersions.downloads[core]
	}
	// 如果是非Windows系统，在downloadUrl的文件名中加上-mac后缀
	if (!platform.isWindows) {
		downloadUrl = downloadUrl.replace(/(\.[^.]+)$/, "-mac$1")
		logger.info(`[${core}] 非Windows系统，下载地址调整为: ${downloadUrl}`)
	}
	return await downloadCore(core, downloadVersion, downloadUrl)
}
