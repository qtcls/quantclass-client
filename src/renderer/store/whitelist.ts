/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { atomWithQuery } from "jotai-tanstack-query"

const { getStoreValue } = window.electronAPI

// -- 创建查询 atom 获取白名单数据
export const whiteListQueryAtom = atomWithQuery(() => ({
	queryKey: ["data-white-list"],
	queryFn: async () => {
		const data = (await getStoreValue(
			"settings.data_white_list",
			[],
		)) as string[]
		return data.reduce<Record<string, boolean>>((obj, item) => {
			obj[item] = true
			return obj
		}, {})
	},
}))
