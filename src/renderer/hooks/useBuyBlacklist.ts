/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { buyBlacklistAtom } from "@/renderer/store/electron"
import type { BlacklistItem } from "@/renderer/types/trading"
import { useAtom } from "jotai"

export function useBuyBlacklist() {
	const [buyBlacklist, setBuyBlacklist] = useAtom(buyBlacklistAtom)

	// 添加黑名单项
	const addBlacklistItem = async (newItem: BlacklistItem) => {
		const updatedBlacklist = [...buyBlacklist, newItem]

		try {
			setBuyBlacklist(updatedBlacklist)
		} catch (error) {
			console.error("添加黑名单项失败:", error)
			throw error
		}
	}

	// 删除黑名单项
	const removeBlacklistItem = async (code: string) => {
		const updatedBlacklist = buyBlacklist.filter((item) => item.code !== code)

		try {
			setBuyBlacklist(updatedBlacklist)
		} catch (error) {
			console.error("删除黑名单项失败:", error)
			throw error
		}
	}

	const isBlacklisted = (code: string) => {
		return buyBlacklist?.some((item) => item.code === code)
	}

	return {
		buyBlacklist,
		addBlacklistItem,
		removeBlacklistItem,
		setBuyBlacklist,
		isBlacklisted,
	}
}
