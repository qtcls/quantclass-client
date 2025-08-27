/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	PositionInfoType,
	PositionStockInfoType,
	PositionStrategyInfoType,
} from "@/renderer/page/position/types"
import { formatCurrency } from "@/renderer/utils/formatCurrency"
import { DataTableColumnHeader } from "@/renderer/components/ui/data-table-column-heder"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InfoIcon } from "lucide-react"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/renderer/components/ui/tooltip"

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
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="持仓量" />
			),
			enableSorting: true,
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

export const usePositionStockInfoColumns =
	(): ColumnDef<PositionStockInfoType>[] => {
		return [
			{
				accessorKey: "策略名称",
				header: "策略名称",
			},
			{
				accessorKey: "证券代码",
			},
			{
				accessorKey: "证券名称",
				header: "证券名称",
			},
			{
				accessorKey: "持仓量",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="持仓量" />
				),
				enableSorting: true,
			},
			{
				accessorKey: "占比",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="占比" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>{((row.original?.占比 ?? 0) * 100).toFixed(2)}%</span>
				},
			},
			{
				accessorKey: "offset",
				header: "offset",
			},
			{
				accessorKey: "当日盈亏",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="当日盈亏" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>￥{formatCurrency(row.original?.当日盈亏 ?? 0)}</span>
				},
			},
			{
				accessorKey: "累计盈亏",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="累计盈亏" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>￥{formatCurrency(row.original?.累计盈亏 ?? 0)}</span>
				},
			},
			{
				accessorKey: "累计收益率",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="累计收益率" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return (
						<span>{((row.original?.累计收益率 ?? 0) * 100).toFixed(4)}%</span>
					)
				},
			},
			{
				accessorKey: "滑点（‰）",
				header: () => (
					<Tooltip delayDuration={0}>
						<TooltipTrigger>
							<div className="flex items-center gap-2">
								<InfoIcon className="w-4 h-4" />
								<span>滑点（‰）</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="left" align="start" sideOffset={10}>
							<p>滑点为None的几个原因：</p>
							<p>1、今天新买的股票，会在收盘之后计算滑点</p>
							<p>2、历史持仓的股票无法计算滑点</p>
							<p>3、无法识别策略的股票，也可能无法计算滑点</p>
						</TooltipContent>
					</Tooltip>
				),
				cell: ({ row }) => {
					return <span>{row.original?.["滑点（‰）"] ?? "--"}</span>
				},
			},
		]
	}

export const usePositionStrategyInfoColumns =
	(): ColumnDef<PositionStrategyInfoType>[] => {
		return [
			{
				accessorKey: "策略名称",
				header: "策略名称",
			},
			{
				accessorKey: "占比",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="占比" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>{((row.original?.占比 ?? 0) * 100).toFixed(2)}%</span>
				},
			},
			{
				accessorKey: "占用资金",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="占用资金" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>￥{formatCurrency(row.original?.占用资金 ?? 0)}</span>
				},
			},
			{
				accessorKey: "当日盈亏",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="当日盈亏" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return <span>￥{formatCurrency(row.original?.当日盈亏 ?? 0)}</span>
				},
			},
			{
				accessorKey: "当日收益率",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="当日收益率" />
				),
				enableSorting: true,
				cell: ({ row }) => {
					return (
						<span>{((row.original?.当日收益率 ?? 0) * 100).toFixed(4)}%</span>
					)
				},
			},
		]
	}
