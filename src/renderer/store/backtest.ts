/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const { getStoreValue, setStoreValue } = window.electronAPI

const defaultBacktestExecTime = {
	startTime: "--:--:--",
	endTime: "--:--:--",
}

const baseAtom = atomWithStorage<{
	startTime: string
	endTime: string
}>("backtestExecTime", defaultBacktestExecTime, undefined, { getOnInit: true })

export const backtestExecTimeAtom = atom(
	// 读取时直接从 baseAtom 读取
	(get) => get(baseAtom),
	// 写入时更新 baseAtom，并通过 IPC 通知主进程
	(_, set, update) => {
		// 更新本地存储
		set(baseAtom, update as any)
		// 通过 IPC 通知主进程：写入新数据
		setStoreValue("backtestExecTime", update)
	},
)

backtestExecTimeAtom.onMount = (set) => {
	getStoreValue("backtestExecTime", defaultBacktestExecTime)
		.then((value) => {
			// 确保传递的是纯数据对象
			set(JSON.parse(JSON.stringify(value)))
		})
		.catch((error) => {
			console.error("获取数据失败：", error)
		})
}
