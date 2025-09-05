/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { ipcRenderer } from "electron"

export const systemIPC = {
	// 进程控制
	handleKillProcess: (pid: number) => ipcRenderer.invoke("kill-process", pid),

	// 全屏控制
	handleToggleFullscreen: () => ipcRenderer.invoke("toggle-fullscreen"),
	fetchFullscreenState: () => ipcRenderer.invoke("fetch-fullscreen-state"),

	// 窗口控制 - 从renderer/ipc/system.ts迁移
	createTerminalWindow: () => ipcRenderer.invoke("create-terminal-window"),
	focusMainWindows: () => ipcRenderer.invoke("focus-main-windows"),
	closeApp: (key = "main") => ipcRenderer.invoke("close-app", key),
	minimizeApp: (key = "main") => ipcRenderer.invoke("minimize-app", key),
	restartApp: () => ipcRenderer.invoke("restart-app"),

	// 系统配置
	setAutoLaunch: (auto: boolean) =>
		ipcRenderer.invoke("set-is-auto-login", auto),
	setAutoUpdate: () => ipcRenderer.invoke("set-auto-update"),

	// 版本管理
	checkUpdate: (now = true) => ipcRenderer.invoke("check-update", now),
	updateCore: (name: string, targetVersion?: string) =>
		ipcRenderer.invoke("update-core", name, targetVersion),
	getCoreAndClientVersions: () =>
		ipcRenderer.invoke("get-core-and-client-versions"),

	// 系统信息
	getMacAddress: () => ipcRenderer.invoke("get-mac-address"),

	// 服务控制
	startServer: () => ipcRenderer.invoke("start-server"),
}
