/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { PositionInfoType } from "@/renderer/page/position/types"
import { formatCurrency } from "@/renderer/utils/formatCurrency"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"

export const usePositionInfoColumns = (): ColumnDef<PositionInfoType>[] => {
	return [
		{
			accessorKey: "策略名称",
			meta: {
				filterVariant: "select",
			},
		},
		{
			accessorKey: "证券代码",
			header: "证券代码",
		},
		{
			accessorKey: "其他",
			header: "其他",
			size: 150,
			cell: ({ row }) => {
				return (
					<div className="w-20 break-words">{row.original?.其他 ?? "-"}</div>
				)
			},
		},
		{
			accessorKey: "持仓量",
			header: "持仓量",
		},
		{
			accessorKey: "成交均价",
			header: "成交均价",
			cell: ({ row }) => {
				return <span>{formatCurrency(row.original?.成交均价 ?? 0)}</span>
			},
		},
		{
			accessorKey: "交易日期",
			header: "买入日期",
			cell: ({ row }) => {
				return (
					<span>
						{row.original?.交易日期
							? dayjs(row.original.交易日期).format("YYYY-MM-DD")
							: "--:--"}
					</span>
				)
			},
		},
		{
			accessorKey: "卖出日期",
			header: "卖出日期",
			cell: ({ row }) => {
				return (
					<span>
						{row.original?.计划卖出日期
							? dayjs(row.original.计划卖出日期).format("YYYY-MM-DD")
							: "--:--"}
					</span>
				)
			},
		},
	]
}
