/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { QueryObserverResult, RefetchOptions } from "@tanstack/query-core"

export type RunResultType = {
	策略: string
	持仓周期: string
	换仓时间: string
	股票代码: string
	股票名称: string
	选股日期: string
	目标资金占比: number
}

export type ILatestResultType = {
	交易日期: string
	资金分配: number
	选股日收盘价: number
	预计股数: number
	下单金额: number
}

export type LatestResultType = ILatestResultType & RunResultType

export type RunResultContextType = {
	refresh: (options?: RefetchOptions) => Promise<
		QueryObserverResult<
			{
				success: boolean
				data?: RunResultType[] | undefined
				error?: string | undefined
			},
			Error
		>
	>
	loading: boolean
	isPending: boolean
	data:
		| {
				success: boolean
				data?: RunResultType[] | LatestResultType[] | undefined
				error?: string | undefined
		  }
		| undefined
	selectValue: string | undefined
	setSelectValue: (value: string | undefined) => void
	resetData: () => void
}
