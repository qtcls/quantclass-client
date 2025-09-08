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
import { getCoreAndClientVersions } from "@/main/core/lib.js"
import {
	setAutoTrading,
	setAutoUpdate,
	systemState,
} from "@/main/lib/scheduler.js"
import logger from "@/main/utils/wiston.js"
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

async function handleGetCoreAndClientVersion(): Promise<void> {
	ipcMain.handle("get-core-and-client-version", async (_event) => {
		return await getCoreAndClientVersions()
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
	getMacAddressHandler()
	handleGetCoreAndClientVersion()
	syncNetworkStatusHandler()
	console.log("[reg] core-ipc")
}
