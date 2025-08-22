/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useCallback, useSyncExternalStore } from "react"

const getOnLineStatus = () =>
	typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
		? navigator.onLine
		: true

export function useSystemOnline(): boolean {
	return useSyncExternalStore(
		useCallback((onStoreChange) => {
			window.addEventListener("online", onStoreChange)
			window.addEventListener("offline", onStoreChange)
			return () => {
				window.removeEventListener("online", onStoreChange)
				window.removeEventListener("offline", onStoreChange)
			}
		}, []),
		useCallback(() => getOnLineStatus(), []),
		useCallback(() => true, []),
	)
}
