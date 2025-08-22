/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { platform } from "@electron-toolkit/utils"
import { type BrowserWindow, Menu, type Tray, app } from "electron"
import { isDev } from "../utils/common.js"

export const createMenu = (mainWindow: BrowserWindow, tray?: Tray) => {
	const menuTemplate: any[] = [
		{
			label: app.name,
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{
					label: "打开/关闭控制台",
					accelerator: "F12",
					click: () => {
						const isDevToolsOpened = mainWindow?.webContents.isDevToolsOpened()

						if (!isDevToolsOpened) {
							mainWindow?.webContents.openDevTools()
						}

						if (isDevToolsOpened) {
							mainWindow?.webContents.closeDevTools()
						}
					},
				},
				{
					role: "quit",
					accelerator: "CmdOrCtrl+Q",
					click: () => {
						tray?.destroy()
						mainWindow.destroy()
						app.quit()
					},
				},
				...(platform.isMacOS
					? [
							{ role: "pasteAndMatchStyle" },
							{ role: "delete" },
							{ role: "selectAll" },
							{ type: "separator" },
							{
								label: "Speech",
								submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
							},
						]
					: [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
			],
		},
	]

	if (isDev) {
		menuTemplate.push({
			label: "调试", // 新增的调试菜单
			submenu: [
				{
					label: "打开开发者工具",
					click: () => {
						mainWindow.webContents.openDevTools()
					},
				},
				{
					label: "刷新页面", // 新增的刷新页面菜单项
					click: () => {
						mainWindow.webContents.reload()
					},
				},
				{
					label: "后退", // 新增的后退菜单项
					click: () => {
						mainWindow.webContents.goBack() // 后退到上一个页面
					},
				},
			],
		})
	}

	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
}
