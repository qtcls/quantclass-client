/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { execSync } from "node:child_process"
import fs, { promises as fsPromises, readdirSync, unlinkSync } from "node:fs"
import net from "node:net"
import path from "node:path"
import util from "node:util"
import store from "@/main/store/index.js"
import logger from "@/main/utils/wiston.js"
import { platform } from "@electron-toolkit/utils"
import { serve } from "@hono/node-server"
import dayjs from "dayjs"
import { app } from "electron"
import iconv from "iconv-lite"

/**
 * 删除指定的锁文件
 * @param lockName - 要删除的锁文件名
 */
export async function removeLockFile(lockName: string): Promise<void> {
	const userDataPath = getUserDataPath()
	const lockFilePath = path.join(userDataPath, lockName)

	// -- 如果锁文件不存在,直接返回
	if (!fs.existsSync(lockFilePath)) {
		return
	}

	try {
		await fsPromises.unlink(lockFilePath)
		logger.info(`[LOCK] #### del ${lockName}.`)
	} catch (error) {
		logger.error(`[LOCK] #### del ${lockName} failed`)
		logger.error(error)
	}
}

export async function cleanLockFiles() {
	// 查找并删除所有 *.app.lock 文件
	const userDataPath = getUserDataPath()

	try {
		const files = await fsPromises.readdir(userDataPath)
		const lockFiles = files.filter((file) => file.endsWith(".app.lock"))

		for (const lockFile of lockFiles) {
			const lockFilePath = path.join(userDataPath, lockFile)
			try {
				await fsPromises.unlink(lockFilePath)
				logger.info(`[LOCK] #### del ${lockFile}`)
			} catch (error) {
				logger.error(`[LOCK] #### del ${lockFile} failed`)
				logger.error(error)
			}
		}
	} catch (error) {
		logger.error("[LOCK] #### 读取用户数据目录失败")
		logger.error(error)
	}
}

/**
 * 创建指定的锁文件
 * @param lockName - 要创建的锁文件名
 */
export async function createLockFile(lockName: string): Promise<void> {
	const userDataPath = getUserDataPath()
	const lockFilePath = path.join(userDataPath, lockName)

	try {
		await fsPromises.access(lockFilePath, fs.constants.F_OK)
		// -- 文件已存在,不需要创建
	} catch {
		// -- 文件不存在,创建新文件
		logger.info(`[LOCK] #### add ${lockName}`)
		try {
			await fsPromises.writeFile(lockFilePath, "lock")
		} catch (error) {
			logger.error(`[LOCK] #### add ${lockName} failed`)
			throw error
		}
	}
}

/**
 * 获取用户数据路径
 * @returns 用户数据路径字符串
 */
export function getUserDataPath() {
	// -- 判断是否在 Electron 环境中
	return app ? app.getPath("userData") : "/Users/chrischen/Downloads/test_xbx"
}

/**
 * 检查指定的锁文件是否存在
 * @param lockName - 要检查的锁文件名,默认为 "python.lock"
 * @returns Promise<boolean> 表示锁文件是否存在
 */
export function checkLock(lockName = "python.lock"): Promise<boolean> {
	const userDataPath = app.getPath("userData")
	const lockFilePath = path.join(userDataPath, lockName)

	// -- 使用 util.promisify 将 fs.exists 转换为返回 Promise 的函数
	const exists = util.promisify(fs.exists)

	return exists(lockFilePath)
}

const _isPidRunningUnix = (pid: string) => {
	try {
		execSync(`kill -0 ${pid}`)
		return true
	} catch (e) {
		return false
	}
}

const _isPidRunningWindows = (pid: string) => {
	try {
		// -- 使用 PowerShell 命令检查进程，并设置输出编码
		execSync(`powershell -Command "Get-Process -Id ${pid} -ErrorAction Stop"`, {
			// stdin 用 pipe（默认），stdout 忽略（不输出），stderr 仍然捕获（以便后续处理）
			stdio: ["pipe", "ignore", "pipe"],
			encoding: "buffer", // -- 获取原始 Buffer
		})
		return true
	} catch (e) {
		const error = e as Error & { stderr?: Buffer }
		if (error.stderr) {
			const err = iconv.decode(error.stderr, "gbk")
			if (!err.includes("NoProcessFoundForGivenId"))
				logger.error(`[pid] 检查进程失败: ${err}`)
		}
		return false
	}
}

/**
 * 检查指定 PID 的进程是否正在运行
 * @param pid - 要检查的进程 ID
 * @returns boolean 表示进程是否正在运行
 */
export const isPidRunning = (pid: string) => {
	if (platform.isWindows) {
		return _isPidRunningWindows(pid)
	}

	// -- Unix-like 平台使用 kill -0 命令
	return _isPidRunningUnix(pid)
}

const PID_LOCK_PATH = {
	fuel: ["code", "data"],
	aqua: ["real_trading", "data", "locker"],
	rocket: ["real_trading", "rocket", "data"],
}

export const isCoreRunning = async (
	core: "fuel" | "aqua" | "rocket" | "zeus",
	strictMode = false,
) => {
	let isRunning = false

	// -- 严格模式下额外检查进程名
	if (strictMode && platform.isWindows) {
		try {
			const result = execSync(`tasklist /FI "IMAGENAME eq ${core}.exe" /NH`, {
				stdio: ["pipe", "pipe", "pipe"],
				encoding: "utf-8",
			})
			logger.info(`[${core}] 检查进程: ${result}`)
			if (result.includes(`${core}.exe`)) {
				isRunning = true
			}
		} catch (e) {
			const error = e as Error & { stderr?: Buffer }
			if (error.stderr) {
				const err = iconv.decode(error.stderr, "gbk")
				logger.error(`[${core}] 检查进程失败: ${err}`)
			}
		}
	}

	const pidLockPath: string = await store.getAllDataPath(
		PID_LOCK_PATH[core],
		true,
	)
	logger.info(`[${core}] 检查运行中的进程: ${pidLockPath}`)

	// -- 检查文件夹是否存在
	if (!fs.existsSync(pidLockPath)) {
		logger.info(`[${core}] 进程锁文件夹不存在，运行中: ${isRunning}`)
		return isRunning
	}

	const lockFiles = fs
		.readdirSync(pidLockPath)
		.filter((file) => file.endsWith(".py.lock"))

	logger.info(`[${core}] 进程锁文件数量: ${lockFiles.length}`)

	for (const lockFile of lockFiles) {
		const pid = lockFile.split(".")[0]
		const _isRunning = isPidRunning(pid)
		logger.info(`[${core}] ${pid} running: ${_isRunning}, path: (${lockFile})`)

		if (!_isRunning) {
			// -- 进程不存在,删除锁文件
			const lockFilePath = `${pidLockPath}/${lockFile}`
			try {
				// -- 先检查文件是否存在
				if (fs.existsSync(lockFilePath)) {
					unlinkSync(lockFilePath)
					logger.info(`[${core}] 清理历史 lock 文件: ${lockFile}`)
				}
			} catch (e) {
				logger.error(`[${core}] 清理历史 lock 文件失败: ${e}`)
			}
		} else {
			isRunning = true // -- 有一个进程在运行
		}
	}

	logger.info(`[${core}] 运行中: ${isRunning}`)

	return isRunning
}

/**
 * 检查 Fuel 二进制文件是否正在运行
 * @returns Promise<boolean> 表示是否有 Fuel 进程正在运行
 */
export const isFuelCoreRunning = async () => {
	return isCoreRunning("fuel")
}

/**
 * 检查 Real Trading 二进制文件是否正在运行
 * @returns Promise<boolean> 表示是否有 Real Trading 进程正在运行
 */
export const isAquaCoreRunning = async () => {
	return isCoreRunning("aqua")
}

export const isZeusCoreRunning = async () => {
	return isCoreRunning("zeus")
}

/**
 * 检查 Rocket 二进制文件是否正在运行
 * @returns Promise<boolean> 表示是否有 Rocket 进程正在运行
 */
export const isRocketCoreRunning = async () => {
	return isCoreRunning("rocket", true) // -- rocket 仅在 Windows 下运行，且需要严格模式
}

export const isCoreUpdating = async (
	core: "fuel" | "aqua" | "rocket" | "zeus",
) => {
	return checkLock(`update_${core.toLowerCase()}.app.lock`)
}

/**
 * 检查内核是否正忙，会包含 updating 和 running 两个状态
 * @param {String} name - 内核名称
 * @returns {Boolean} - 是否正忙
 */
export async function isCoreBusy(name: string): Promise<boolean> {
	let isRunning = false
	let isUpdating = false
	switch (name) {
		case "aqua":
			isRunning = await isCoreRunning("aqua")
			isUpdating = await isCoreUpdating("aqua")
			break
		case "zeus":
			isRunning = await isCoreRunning("zeus")
			isUpdating = await isCoreUpdating("zeus")
			break
		case "rocket":
			isRunning = await isCoreRunning("rocket", true) // -- rocket 仅在 Windows 下运行，且需要严格模式
			isUpdating = await isCoreUpdating("rocket")
			break
		case "fuel":
			isRunning = await isCoreRunning("fuel")
			isUpdating = await isCoreUpdating("fuel")
			break
	}

	if (isUpdating) {
		logger.info(`[${name}] 内核正在更新`)
		return true
	}

	if (isRunning) {
		logger.info(`[${name}] 内核正在运行`)
		return true
	}

	return false
}

/**
 * 检查多个内核是否有一个正忙
 * @param cores 需要检查的核心
 * @returns 这些核心中是否有一个核心正忙
 */
export async function isAnyCoreBusy(
	cores = ["aqua", "fuel", "zeus"],
): Promise<boolean> {
	for (const core of cores) {
		if (await isCoreBusy(core)) {
			return true
		}
	}
	return false
}

/**
 * 强制结束所有 Fuel 进程
 * @param isManual - 是否为手动调用,默认为 false
 */
export const killCoreByForce = async (
	core: "fuel" | "aqua" | "rocket" | "zeus",
	strictMode = false,
) => {
	const pidLockFilePath: string = await store.getAllDataPath(
		PID_LOCK_PATH[core],
		true, // -- 自动创建文件夹
	)

	if (!fs.existsSync(pidLockFilePath)) {
		logger.info(`[${core}] 进程锁文件夹不存在，运行中: ${strictMode}`)
		return
	}

	const lockFiles = readdirSync(pidLockFilePath).filter((file) =>
		file.endsWith(".py.lock"),
	)

	// -- 根据平台选择合适的终止进程命令
	/**
	 * Windows10 下 taskkill 有时会因 chcp 65001 导致 encoding 报错，
	 * 这里移除 chcp，直接执行 taskkill，避免编码问题。
	 */
	const killCommand = (pid: string) => {
		return platform.isWindows ? `taskkill /PID ${pid} /T /F` : `kill -9 ${pid}`
	}
	logger.info(`[${core}] 运行中的进程数量: ${lockFiles}`)
	for (const lockFile of lockFiles) {
		const pid = lockFile.split(".")[0]
		logger.info(`[${core}] kill ${pid}`)
		try {
			execSync(killCommand(pid), { stdio: "ignore" })
		} catch (e) {
			// -- 忽略错误,因为进程可能已经不存在
			logger.error(`[${core}] 清理 ${lockFile} 进程失败: ${e}`)
		} finally {
			unlinkSync(`${pidLockFilePath}/${lockFile}`)
		}
	}
	// console.log("33333")
	if (strictMode) {
		const killCommandByName = platform.isWindows
			? `taskkill /IM ${core}.exe /T /F`
			: `pkill -f ${core}`
		try {
			execSync(killCommandByName, { stdio: "ignore" })
			logger.info(`[${core}] 所有 ${core} 进程已被强制终止`)
		} catch (e) {
			logger.error(`[${core}] 强制终止 ${core} 进程失败: ${e}`)
		}
	}
}

export const killAllCoreByForce = async (
	strictMode = false,
	cores: ("fuel" | "aqua" | "rocket" | "zeus")[] = [
		"fuel",
		"aqua",
		"rocket",
		"zeus",
	],
) => {
	logger.info(`[kill] ${cores.join(", ")} ${strictMode}`)
	for (const core of cores) {
		if (!platform.isWindows && core === "rocket") continue
		await killCoreByForce(core, core === "rocket" || strictMode) // -- rocket 仅在 Windows 下运行，杀死时候做强杀
	}
}

/**
 * 在可用端口上启动服务器
 * @param initialPort - 初始尝试的端口号
 * @param server - 服务器实例
 * @returns Promise<number> 成功启动的端口号
 */
export const startServerOnAvailablePort = async (
	initialPort: number,
	server: any,
): Promise<number> => {
	// -- 检查端口是否可用
	const isPortAvailable = (port: number): Promise<boolean> => {
		return new Promise((resolve) => {
			const tester = net
				.createServer()
				.once("error", () => resolve(false))
				.once("listening", () => {
					tester.once("close", () => resolve(true)).close()
				})
				.listen(port)
		})
	}

	// -- 递归尝试启动服务器
	const startServer = async (port: number): Promise<number> => {
		if (await isPortAvailable(port)) {
			serve({ fetch: server.fetch, port }, (info) => {
				logger.info(`服务器正在监听 http://localhost:${info.port}`)
			})
			// if (platform.isWindows) await startHeartbeatCheck()
			logger.info("启动心跳检查")
			return port
		}
		logger.warn(`端口 ${port} 不可用,尝试下一个端口`)
		return startServer(port + 1)
	}

	return startServer(initialPort)
}

/**
 * 判断当前是否为交易日
 * @returns boolean 表示当前是否为交易日
 */
export const isTradingTime = (): boolean => {
	const now = dayjs()
	// -- 判断是否为周末
	const isWeekend = _isWeekend(now)

	// -- 判断是否在交易时间内
	const startTime = now.set("hour", 9).set("minute", 0)
	const endTime = now.set("hour", 15).set("minute", 30)
	const isWithinTradingHours = now.isBetween(startTime, endTime)

	return !isWeekend && isWithinTradingHours
}

export const _isWeekend = (now: dayjs.Dayjs): boolean =>
	now.day() === 0 || now.day() === 6

// -- 添加检查下载次数的函数
export async function checkDownloadLimit(type: string): Promise<boolean> {
	const now = dayjs()
	const lastDownloadTime = (await store.getValue(
		`${type}_last_download_time`,
		"",
	)) as string
	const downloadCount = await store.getValue(`${type}_download_count`, 0)

	if (!lastDownloadTime) {
		store.setValue(`${type}_last_download_time`, now.format())
		store.setValue(`${type}_download_count`, 1)
		return true
	}

	const lastTime = dayjs(lastDownloadTime)
	// -- 检查是否是同一天
	const isSameDay = now.isSame(lastTime, "day")

	if (!isSameDay) {
		// -- 不是同一天，重置计数
		store.setValue(`${type}_last_download_time`, now.format())
		store.setValue(`${type}_download_count`, 1)
		return true
	}

	if (downloadCount >= 10) {
		logger.warn(`[${type}] 内核今日下载次数已达上限`)
		return false
	}

	// -- 增加计数
	store.setValue(`${type}_download_count`, downloadCount + 1)
	return true
}

export const sendErrorToClient = async (errorMessage: string) => {
	try {
		const server_port = await store.getValue("server_port", 8787)

		await fetch(`http://localhost:${server_port}/error`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code: 400,
				message: errorMessage,
			}),
		})
	} catch (e) {
		logger.error("[sendMsgToRobot] 客户端通信失败，本地服务可能未成功启动", e)
	}
}
