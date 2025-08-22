/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { fileURLToPath } from "node:url"
import WindowManager from "@/main/lib/WindowManager.js"
import { is } from "@electron-toolkit/utils"
import { type BrowserWindowConstructorOptions, ipcMain } from "electron"

const createTerminalWindow = () => {
	ipcMain.handle(
		"create-terminal-window",
		async (_, options: BrowserWindowConstructorOptions) => {
			let win = WindowManager.getWindowById("terminal")

			if (win) {
				if (!win.isFocused()) {
					win.show()
					win.focus()
				} else {
					win.minimize()
				}
			} else {
				win = WindowManager.createChildWindow("terminal", options)

				if (is.dev && process.env.ELECTRON_RENDERER_URL) {
					win.loadURL(`${process.env.ELECTRON_RENDERER_URL}/terminal.html`)
				} else {
					win.loadFile(
						fileURLToPath(
							new URL("../renderer/terminal.html", import.meta.url),
						),
					)
				}
			}

			if (process.env.VITE_XBX_ENV === "development") {
				win.webContents.openDevTools()
			}

			return true
		},
	)
}

const focusMainWindow = () => {
	ipcMain.handle("focus-main-windows", () => {
		const mw = WindowManager.getWindow()

		mw?.focus()
	})
}

export const regWindowsIPC = () => {
	focusMainWindow()
	createTerminalWindow()
	console.log("[ok] windows-ipc")
}
