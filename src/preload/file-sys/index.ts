/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { type OpenDialogOptions, ipcRenderer } from "electron"

export const fileSysIPC = {
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	openUrl: (url: string) => ipcRenderer.send("open-url", url),
	openDirectory: (path: string[]) => ipcRenderer.invoke("open-directory", path),
	openDataDirectory: (path?: string[] | string) =>
		ipcRenderer.invoke("open-data-directory", path),
	openUserDirectory: (path?: string[] | string) =>
		ipcRenderer.invoke("open-user-directory", path),
	getStoreValue: (key: string, defaultValue?: any) =>
		ipcRenderer.invoke("get-store", key, defaultValue),
	setStoreValue: (key: string, value: any) =>
		ipcRenderer.invoke("set-store", key, value),
	deleteStoreValue: (key: string) => ipcRenderer.invoke("delete-store", key),
	createDirectory: (path: string[] | string) =>
		ipcRenderer.invoke("create-directory", path),
	createStrategyDir: () => ipcRenderer.invoke("create-strategy-dir"),
	createRealTradingDir: (dirName = "real_trading") =>
		ipcRenderer.invoke("create-real-trading-dir", dirName),
	selectDirectory: (
		properties: OpenDialogOptions["properties"] = ["openDirectory"],
		opts: OpenDialogOptions = {},
	) => ipcRenderer.invoke("open-directory-select", properties, opts),
	selectFile: (opts: OpenDialogOptions = {}) =>
		ipcRenderer.invoke("open-directory-select", ["openFile"], opts),
	// 判断是否在进行core的更新，如果更新就锁住
	checkFuelUpdateLockFile: () => ipcRenderer.invoke("check-fuel-update-lock"),
	forceKillAllProcesses: () => ipcRenderer.invoke("force-kill-all-processes"),
	importSelectStock: (configFilePath: string) =>
		ipcRenderer.invoke("import-select-stock", configFilePath),
	importFusion: (configFilePath: string) =>
		ipcRenderer.invoke("import-fusion", configFilePath),
	readChangelog: () => ipcRenderer.invoke("read-changelog"),
	loadPositionJson: (filename: string) =>
		ipcRenderer.invoke("load-position-json", filename),
}
