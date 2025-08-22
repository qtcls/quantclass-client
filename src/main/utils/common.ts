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
import { existsSync } from "node:fs"
import fs from "node:fs/promises"
import { arch } from "node:os"
import path from "node:path"
import store from "@/main/store/index.js"
import logger from "@/main/utils/wiston.js"
import { platform } from "@electron-toolkit/utils"
import { app } from "electron"

export const WINDOW_HEIGHT = 720
export const WINDOW_WIDTH = 1280
export const WINDOW_MIN_HEIGHT = 600
export const WINDOW_MIN_WIDTH = 980

export const isDev = !app.isPackaged

export const MAIN_MSG_CODE = {
	// 更新通知
	UPDATE_NOTICE: 500,
	// 更新不可用/已是最新
	UPDATE_NOT_AVAILABLE: 501,
	// 安装失败
	UPDATE_INSTALL_FAILED: 502,
	// 更新下载完毕，提示安装更新
	UPDATE_DOWNLOAD_FINISH: 503,
	// 回测使用代码
	BACKTEST_CODE: 504,
	// 计算交易计划
	CALC_TRADING_PLAN: 600,
	// Real Trading 正在运行中
	REAL_TRADING_RUNNING: 700,
}

export enum Channels {
	// app updater
	AppUpdaterConfirm = "AppUpdaterConfirm",
	AppUpdaterProgress = "AppUpdaterProgress",
	AppUpdaterAbort = "AppUpdaterAbort",
}

/**
 * 获取Fuel内核路径。因为Fuel的逻辑相对于我们其他的模块会更加复杂，所以单独写一个函数
 * @returns 内核路径
 */
export const GetExecFuelFile = async () => {
	const pyCodePath = await store.getAllDataPath(["code"])
	let execFuelFilePath = ""

	if (platform.isWindows) {
		execFuelFilePath = path.join(pyCodePath, "fuel", "fuel.exe")
	} else if (platform.isMacOS) {
		if (arch() === "arm64") {
			execFuelFilePath = path.join(pyCodePath, "fuel")
		}
		if (arch() === "x64") {
			execFuelFilePath = path.join(pyCodePath, "fuel2")
		}

		if (existsSync(execFuelFilePath)) {
			try {
				await fs.chmod(execFuelFilePath, 0o755)
			} catch (error) {
				logger.error(
					`[GetExecFuelFile]: ${execFuelFilePath} 内核权限设置失败: ${error}`,
				)
			}

			exec(`chmod +x ${execFuelFilePath}`)
		} else {
			logger.info(`[GetExecFuelFile]: ${execFuelFilePath} 内核暂不存在`)
		}
	}

	return path.normalize(execFuelFilePath)
}

/**
 * 获取内核路径
 * @param kernel 内核名称
 * @returns 内核路径
 */
export const getBinPath = async (kernel: string) => {
	// 如果是fuel，则直接返回可执行文件路径
	if (kernel === "fuel") {
		return await GetExecFuelFile()
	}

	const pyCodePath = await store.getAllDataPath(["code"])
	// 2025年5月27日开始，所有内核采用onedir的打包方式，所以需要替换exe为zip
	const folderName = platform.isWindows ? kernel : `${kernel}-${arch()}`
	let binPath: string = path.join(pyCodePath, folderName, kernel)

	if (platform.isWindows) {
		binPath = `${binPath}.exe`
	} else {
		exec(`chmod +x ${binPath}`)
	}

	if (existsSync(binPath)) {
		try {
			await fs.chmod(binPath, 0o755)
		} catch (error) {
			logger.error(`[getBinPath]: ${binPath} 内核权限设置失败: ${error}`)
		}
	}

	return path.normalize(binPath)
}

export const tradingCalender = async () => {
	if (platform.isWindows) {
		const periodOffsetPath = await store.getAllDataPath(
			["period_offset.csv"],
			false,
		)

		// -- 动态导入，只在需要时加载
		const { getTradingCalendar } = await import("etc-csv-napi")

		return getTradingCalendar(periodOffsetPath)
	}

	return []
}
