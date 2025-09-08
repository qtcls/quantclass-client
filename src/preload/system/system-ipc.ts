/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { getCoreAndClientVersions } from "@/main/core/lib.js"
import { checkRemoteVersions, updateCore } from "@/main/core/runpy.js"
import windowManager from "@/main/lib/WindowManager.js"
import { process_manager } from "@/main/lib/process.js"
import { setupScheduler } from "@/main/lib/scheduler.js"
import { killAllCoreByForce, killCoreByForce } from "@/main/utils/tools.js"
import { log } from "@/main/utils/wiston.js"
import { electronApp, platform } from "@electron-toolkit/utils"
import { app, ipcMain } from "electron"

async function handleToggleFullscreen() {
	ipcMain.handle("toggle-fullscreen", async (_event, key = "main") => {
		const win = windowManager.getWindowById(key)

		if (win) {
			win.isMaximized() ? win.unmaximize() : win.maximize()
		}
	})
}

async function handleSetAutoLogin() {
	ipcMain.handle("set-is-auto-login", async (_event, auto: boolean) => {
		if (platform.isMacOS) {
			electronApp.setAutoLaunch(auto)
		}
		if (platform.isWindows) {
			app.setLoginItemSettings({
				openAtLogin: auto,
			})
		}
	})
}

function handleMinimize() {
	ipcMain.handle("minimize-app", async (_event, key = "main") => {
		const win = windowManager.getWindowById(key)

		if (win) {
			// mw.focus()
			win.minimize()
		}
	})
}

function handleClose() {
	ipcMain.handle("close-app", async (_event, key = "main") => {
		const win = windowManager.getWindowById(key)

		if (win) {
			win.close()
		}
	})
}

function fetchFullscreenState() {
	ipcMain.handle("fetch-fullscreen-state", async (_event, key = "main") => {
		const win = windowManager.getWindowById(key)

		return win ? win.isMaximized() : false
	})
}

function handleMonitorProcess() {
	ipcMain.handle("fetch-monitor-processes", async () => {
		return process_manager.getRunningProcesses()
	})
}

function handleKillProcess() {
	ipcMain.handle("kill-process", async (_event, pid: number) => {
		return await process_manager.killProcess(pid)
	})
}

function handleKillAllCores() {
	ipcMain.handle("kill-all-cores", async (_event, byForce = false) => {
		return await killAllCoreByForce(byForce)
	})
}

function handleKillCore() {
	ipcMain.handle(
		"kill-core",
		async (
			_event,
			core: "fuel" | "rocket" | "aqua" | "zeus",
			byForce = false,
		) => {
			return await killCoreByForce(core, byForce)
		},
	)
}

function handleSetAutoUpdate() {
	ipcMain.handle("set-auto-update", async (_event) => {
		await setupScheduler()
	})
}

function handleRendererLog() {
	ipcMain.handle(
		"do-renderer-log",
		async (_event, type: "info" | "error" | "warning", msg: string) => {
			log(type, `[Renderer] ${msg}`)
		},
	)
}

function handleRestartApp() {
	ipcMain.handle("restart-app", async () => {
		app.relaunch()
		app.quit()
	})
}

async function handleCheckUpdate(): Promise<void> {
	ipcMain.handle("check-update", async (_event, now = true) => {
		return await checkRemoteVersions(now)
	})
}

async function handleGetCoreAndClientVersions(): Promise<void> {
	ipcMain.handle("get-core-and-client-versions", async () => {
		return await getCoreAndClientVersions()
	})
}

async function handleUpdateCore(): Promise<void> {
	ipcMain.handle(
		"update-core",
		async (_event, name: string, targetVersion?: string) => {
			return await updateCore(
				name as "aqua" | "rocket" | "zeus" | "fuel",
				true,
				targetVersion,
			)
		},
	)
}

export const regSystemIPC = () => {
	handleClose()
	handleMinimize()
	handleRendererLog()
	handleKillProcess()
	handleKillAllCores()
	handleKillCore()
	handleSetAutoLogin()
	handleSetAutoUpdate()
	fetchFullscreenState()
	handleMonitorProcess()
	handleToggleFullscreen()
	handleRestartApp()
	handleGetCoreAndClientVersions()
	handleUpdateCore()
	handleCheckUpdate()
	console.log("[reg] system-ipc")
}
