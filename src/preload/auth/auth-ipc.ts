/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import windowManager from "@/main/lib/WindowManager.js"
import { tokenStore } from "@/main/lib/tokenStore.js"
import logger from "@/main/utils/wiston.js"
import { PAYMENT_GATEWAY_URL } from "@/main/vars.js"
import { ipcMain, shell } from "electron"

const PAYMENT_CLIENT_WINDOW_ID = "payment-client"

// -- 渲染端登录成功后把 access/refresh token 交给主进程统一管理
function setTokensHandler(): void {
	ipcMain.on(
		"auth:set-tokens",
		async (_event, tokens: { access_token: string; refresh_token: string }) => {
			await tokenStore.setTokens(tokens)
		},
	)
}

// -- 渲染端发请求前获取 access_token
function getAccessTokenHandler(): void {
	ipcMain.handle("auth:get-access-token", async () => {
		return await tokenStore.getAccessToken()
	})
}

// -- 渲染端 401 时强制刷新一次 access_token
function forceRefreshHandler(): void {
	ipcMain.handle("auth:force-refresh", async () => {
		return await tokenStore.getAccessToken({ force: true })
	})
}

// -- 渲染端登出 IPC
function logoutHandler(): void {
	ipcMain.handle("auth:logout", async () => {
		await tokenStore.logout()
	})
}

// -- 在内嵌 BrowserWindow 中打开支付平台页面
function openPaymentClientPortalHandler(): void {
	ipcMain.handle("auth:open-payment-client-portal", async () => {
		const accessToken = await tokenStore.getAccessToken()
		if (!accessToken) {
			return { success: false, message: "请先登录" }
		}

		const url = `${PAYMENT_GATEWAY_URL.replace(/\/$/, "")}/client`
		const extraHeaders = `Authorization: Bearer ${accessToken}\r\n`

		try {
			let win = windowManager.getWindowById(PAYMENT_CLIENT_WINDOW_ID)
			if (win && !win.isDestroyed()) {
				await win.loadURL(url, { extraHeaders })
				if (win.isMinimized()) win.restore()
				win.show()
				win.focus()
				return { success: true }
			}

			win = windowManager.createChildWindow(PAYMENT_CLIENT_WINDOW_ID, {
				width: 960,
				height: 720,
				title: "支付中心",
				webPreferences: {
					preload: undefined,
					nodeIntegration: false,
					contextIsolation: true,
					sandbox: true,
					webSecurity: true,
				},
			})

			win.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
				shell.openExternal(targetUrl)
				return { action: "deny" }
			})

			await win.loadURL(url, { extraHeaders })
			return { success: true }
		} catch (error) {
			logger.error(
				`[auth-ipc] 打开支付客户端失败: ${error instanceof Error ? error.message : String(error)}`,
			)
			windowManager.closeWindow(PAYMENT_CLIENT_WINDOW_ID)
			return {
				success: false,
				message: "打开支付页面失败，请稍后重试",
			}
		}
	})
}

export const regAuthIPC = () => {
	setTokensHandler()
	getAccessTokenHandler()
	forceRefreshHandler()
	logoutHandler()
	openPaymentClientPortalHandler()
	console.log("[reg] auth-ipc")
}
