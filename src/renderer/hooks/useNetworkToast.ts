/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useSystemOnline } from "./useSystemOnline"

const { syncNetworkStatus } = window.electronAPI

/**
 * -- 网络状态提示 Hook
 *
 * 该 Hook 用于监听系统网络状态变化并显示相应的提示信息，同时同步状态到主进程
 *
 * 功能：
 * 1. 监听网络状态变化
 * 2. 在网络断开时显示错误提示
 * 3. 在网络恢复时自动关闭提示
 * 4. 同步网络状态到主进程，用于调度控制
 *
 * 使用方式：
 * ```tsx
 * const MyComponent = () => {
 *   useNetworkToast()
 *   return <div>...</div>
 * }
 * ```
 *
 * 实现细节：
 * - 使用 useSystemOnline hook 获取实时网络状态
 * - 使用 toast 显示网络状态提示
 * - 通过 useRef 持久化追踪 toastId
 * - 使用 Infinity 持续显示断网提示，直到网络恢复
 * - 通过 IPC 同步网络状态到主进程
 */
export const useNetworkToast = () => {
	const isOnline = useSystemOnline()
	// -- 使用 useRef 持久化存储 toastId
	const toastIdRef = useRef<string | number>()

	useEffect(() => {
		// -- 同步网络状态到主进程
		syncNetworkStatus(isOnline)

		// -- 网络断开时显示错误提示
		if (!isOnline) {
			// -- 确保不会重复显示 toast
			if (!toastIdRef.current) {
				toastIdRef.current = toast.error("网络连接已断开，请检查网络连接", {
					dismissible: false,
					duration: Number.POSITIVE_INFINITY,
				})
			}
		}

		// -- 网络恢复时关闭提示
		if (isOnline && toastIdRef.current) {
			toast.dismiss(toastIdRef.current)
			toastIdRef.current = undefined
		}

		// -- 组件卸载时清理
		return () => {
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current)
				toastIdRef.current = undefined
			}
		}
	}, [isOnline])
}
