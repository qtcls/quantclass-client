/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { _ipcRenderer } from "@/renderer/constant"
import type { ProgressInfo } from "electron-updater"

export const onUpdateProgress = (
	callback: (progress: ProgressInfo) => void,
) => {
	_ipcRenderer.on("update-progress", (_, progress) => callback(progress))
}

export const unUpdateProgressListener = () => {
	_ipcRenderer.removeAllListeners("update-progress")
}

export const onPowerStatus = (
	callback: (status: "suspend" | "resume") => void,
) => {
	_ipcRenderer.on("power-status", (_, status: "suspend" | "resume") =>
		callback(status),
	)
}

export const unPowerStatusListener = () => {
	_ipcRenderer.removeAllListeners("power-status")
}

export const onPythonOutPut = (
	callback: (output: string, type: "fuel" | "realMarket") => void,
) => {
	_ipcRenderer.on("send-python-output", (_, output, type) =>
		callback(output, type),
	)
}

export const unPythonOutPutListener = () => {
	_ipcRenderer.removeAllListeners("send-python-output")
}
