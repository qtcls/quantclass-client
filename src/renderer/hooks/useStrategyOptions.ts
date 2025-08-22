/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useAtom } from "jotai"
import { atomWithQuery } from "jotai-tanstack-query"
import { RESET, atomWithReset } from "jotai/utils"
import { compact } from "lodash-es"
import { useCallback, useEffect } from "react"

// -- 定义基础 atoms
const cycleOptionsAtom = atomWithReset<Array<{ label: string; value: string }>>(
	[],
)
const stockOptionsAtom = atomWithReset<Array<{ label: string; value: string }>>(
	[],
)
const selectOptionsAtom = atomWithReset<
	Array<{ label: string; value: string }>
>([])

// -- 定义查询 atom
const strategyDataAtom = atomWithQuery(() => ({
	queryKey: ["strategy-options-data"],
	queryFn: async () => await window.electronAPI.getStrategySelectData(),
}))

export const useStrategyOptions = (open: boolean, watchSelect?: string) => {
	const [{ data, refetch }] = useAtom(strategyDataAtom)
	const [cycleOptions, setCycleOptions] = useAtom(cycleOptionsAtom)
	const [stockOptions, setStockOptions] = useAtom(stockOptionsAtom)
	const [selectOptions, setSelectOptions] = useAtom(selectOptionsAtom)

	// -- 重置函数
	const resetAll = useCallback(() => {
		setCycleOptions(RESET)
		setStockOptions(RESET)
		setSelectOptions(RESET)
	}, [])

	const reset = useCallback(() => {
		setCycleOptions(RESET)
		setStockOptions(RESET)
	}, [])

	// -- 处理选项数据
	useEffect(() => {
		if (data && open) {
			setSelectOptions(
				compact(
					data.map((item) =>
						item.name === "Doppler"
							? null
							: { label: item.fullName, value: item.name },
					),
				),
			)
		}
	}, [data, open])

	// -- 处理 watchSelect 变化
	useEffect(() => {
		if (watchSelect && data && open) {
			const { config } = data.filter((i) => i.name === watchSelect)[0]

			for (const item of config) {
				if (item.title === "换仓周期") {
					setCycleOptions(item.values.map((i) => ({ label: i, value: i })))
				}
				if (item.title === "选股个数") {
					setStockOptions(
						item.values.map((i) => ({ label: i, value: String(i) })),
					)
				}
			}
		}
	}, [watchSelect, data, open])

	return {
		data: data || [],
		cycleOptions,
		stockOptions,
		selectOptions,
		reset,
		resetAll,
		refetch,
	}
}
