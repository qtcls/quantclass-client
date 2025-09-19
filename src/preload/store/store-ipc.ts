/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { type IpcMainInvokeEvent, ipcMain } from "electron"
import Store from "electron-store"

const store = new Store()

const setStoreIPC = () =>
	ipcMain.handle("set-store", (__: IpcMainInvokeEvent, key, value) => {
		store.set(key, value)
	})

const getStoreIPC = () =>
	ipcMain.handle(
		"get-store",
		async (_: IpcMainInvokeEvent, key, defaultValue = {}) => {
			const value = await store.get(key)

			if (typeof value === "boolean") {
				return value
			}

			return (await store.get(key)) || defaultValue
		},
	)

const deleteStoreIPC = () =>
	ipcMain.handle("delete-store", (_: IpcMainInvokeEvent, key) => {
		store.delete(key)
	})

export const regStoreIPC = () => {
	setStoreIPC()
	getStoreIPC()
	deleteStoreIPC()
	console.log("[reg] store-ipc")
}
