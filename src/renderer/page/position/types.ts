/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export type PositionInfoType = {
	策略名称: string
	证券代码: string
	持仓量: number
	交易日期: string
	计划卖出日期: string
	订单标记: string
	上笔委托编号: string
	上笔成交量: number
	成交均价: number
	其他: string
}
