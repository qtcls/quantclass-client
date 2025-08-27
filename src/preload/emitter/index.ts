/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { LoopStatus } from "@/renderer/types/index.js"
import { type IpcRendererEvent, ipcRenderer } from "electron"
import type { UpdateInfo } from "electron-updater"

export const emitterIPC = {
	sendUpdateStatus: (callback: any) =>
		ipcRenderer.on("send-update-status", callback),
	removeSendUpdateStatusListener: () => {
		ipcRenderer.removeAllListeners("send-update-status")
	},
	// onNetworkStatusChange: (callback: any) =>
	//     ipcRenderer.on("network-status", callback),
	startNetworkCheck: () => {
		ipcRenderer.send("start-network-check")
	},
	stopNetworkCheck: () => {
		ipcRenderer.send("stop-network-check")
	},
	subscribeScheduleStatus: (
		callback: (event: IpcRendererEvent, status: LoopStatus) => void,
	) => ipcRenderer.on("send-schedule-status", callback),
	unSubscribeSendScheduleStatusListener: () => {
		ipcRenderer.removeAllListeners("send-schedule-status")
	},
	subscribePowerMonitor: (
		cb: (event: IpcRendererEvent, status: LoopStatus) => void,
	) => {
		ipcRenderer.on("power-monitor", cb)
	},
	unSubscribePowerMonitor: () => {
		ipcRenderer.removeAllListeners("power-monitor")
	},
	startUpdate: () => ipcRenderer.send("start-update"),
	cancelUpdate: () => ipcRenderer.send("cancel-update"),
	onUpdateInfo: (callback: (info: UpdateInfo) => void) =>
		ipcRenderer.on("update-info", (_, info) => callback(info)),
	unUpdateInfoListener: () => {
		ipcRenderer.removeAllListeners("update-info")
	},
	logHandle: (
		msg: Partial<{
			message: string | Event
			source: string
			lineno: number
			colno: number
			error: Error
		}>,
	) => ipcRenderer.send("log-error", msg),
	openUrl: (url: string) => ipcRenderer.send("open-url", url),
}
