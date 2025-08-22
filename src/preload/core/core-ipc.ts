/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { networkInterfaces } from "node:os"
import { getVersionWithLoop } from "@/main/core/lib.js"
import {
	isAquaUpToDate,
	isFuelUpToDate,
	isRocketUpToDate,
	updatePyCore,
} from "@/main/core/runpy.js"
import {
	setAutoTrading,
	setAutoUpdate,
	systemState,
} from "@/main/lib/scheduler.js"
import logger from "@/main/utils/wiston.js"
import { platform } from "@electron-toolkit/utils"
import { ipcMain } from "electron"

async function toggleHandler(): Promise<void> {
	ipcMain.handle("toggle-handle", (_event: { sender: any }, isOn: boolean) => {
		setAutoUpdate(isOn)
	})
}

async function setAutoTradingHandler(): Promise<void> {
	ipcMain.handle(
		"set-auto-trading",
		(_event: { sender: any }, isOn: boolean) => {
			setAutoTrading(isOn)
		},
	)
}

async function getCoreAndClientVersion(): Promise<void> {
	ipcMain.handle(
		"get-core-and-client-version",
		async (_event, isMember: boolean) => {
			return await updatePyCore(isMember)
		},
	)
}

async function checkBinVersion(): Promise<void> {
	ipcMain.handle("check-bin-version", async () => {
		const isFuelConsistent = await isFuelUpToDate()

		if (platform.isWindows) {
			const isRocketVersionConsistent = await isRocketUpToDate()
			const isRealTradingVersionConsistent = await isAquaUpToDate()
			logger.info(
				`[checkBinVersion] 检查版本一致性: fuel: ${isFuelConsistent}, rocket: ${isRocketVersionConsistent}, real_trading: ${isRealTradingVersionConsistent}`,
			)

			if (
				isFuelConsistent &&
				isRocketVersionConsistent &&
				isRealTradingVersionConsistent
			) {
				logger.info("[checkBinVersion] 与远程版本一致")
				return true
			}
		}

		if (isFuelConsistent && !platform.isWindows) {
			logger.info("[checkBinVersion] Fuel 与远程版本一致")
			return true
		}

		logger.info("[checkBinVersion] 本地版本与远程版本不一致，需要更新")
		return false
	})
}

async function getCoreAndClientVersionWithLoop(): Promise<void> {
	ipcMain.handle("get-core-and-client-version-loop", async () => {
		return await getVersionWithLoop()
	})
}

async function syncNetworkStatusHandler() {
	// -- 监听网络状态变化
	ipcMain.on("sync-network-status", (_event, isOnline: boolean) => {
		systemState.isOnline = isOnline
		logger.info(`[network] ${isOnline ? "在线" : "离线"}`)
	})
}

async function getMacAddressHandler(): Promise<void> {
	ipcMain.handle("get-mac-address", async () => {
		const interfaces = networkInterfaces()
		for (const interfaceDetails of Object.values(interfaces)) {
			if (interfaceDetails) {
				for (const detail of interfaceDetails) {
					if (!detail.internal) {
						return detail.mac
					}
				}
			}
		}

		return ""
	})
}

export const regCoreIPC = () => {
	toggleHandler()
	setAutoTradingHandler()
	checkBinVersion()
	getMacAddressHandler()
	getCoreAndClientVersion()
	syncNetworkStatusHandler()
	getCoreAndClientVersionWithLoop()
	console.log("[ok] core-ipc")
}
