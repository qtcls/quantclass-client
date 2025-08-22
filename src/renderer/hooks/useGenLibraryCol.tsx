/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import EditableNumberCell from "@/renderer/components/EditableNumberCell"
import { Badge } from "@/renderer/components/ui/badge"
import { DataTableColumnHeader } from "@/renderer/components/ui/data-table-column-heder"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/renderer/components/ui/tooltip"
import { useToggleAutoRealTrading } from "@/renderer/hooks"
import { DeleteStrategy } from "@/renderer/page/strategy/delete"
import StrategyEditDialog from "@/renderer/page/strategy/edit-dialog"
import { SelectStgType } from "@/renderer/types/strategy"

import { useFusionManager } from "@/renderer/hooks/useFusionManager"
import { useStrategyManager } from "@/renderer/hooks/useStrategyManager"
import { CheckCircledIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { useAtomValue } from "jotai"
import { totalWeightAtom } from "../store/storage"

export const useGenLibraryColumn = (
	refresh: () => void,
	isDisabled = false,
	fusionIndex = -1,
): ColumnDef<SelectStgType>[] => {
	const totalWeight = useAtomValue(totalWeightAtom)
	const { updateFusionStgInRow } = useFusionManager()
	const { isAutoRocket } = useToggleAutoRealTrading()
	const { selectStgList, updateSelectStg } = useStrategyManager()

	const getRebalanceTime = (rebalanceTimeType: string) => {
		const rebalanceTimeList = [
			{
				label: "隔日换仓",
				value: "close-open",
			},
			{
				label: "早盘换仓",
				value: "open",
			},
			// {
			// 	label: "尾盘换仓",
			// 	value: "close",
			// },
		]
		const index = rebalanceTimeList.findIndex(
			(item) => item.value === rebalanceTimeType,
		)
		let rebalanceTimeLabel = rebalanceTimeType
		if (index === -1) {
			const [startTime, endTime] = rebalanceTimeType.split("-") // 使用 '-' 分割字符串
			if (startTime === endTime) {
				rebalanceTimeLabel = `${startTime.slice(0, 2)}:${startTime.slice(2)}`
			}
		} else {
			rebalanceTimeLabel = rebalanceTimeList[index].label
		}
		return rebalanceTimeLabel
	}

	return [
		{
			accessorKey: "cap_weight",
			header: () => (
				<div className="text-muted-foreground flex items-baseline gap-1 text-nowrap">
					资金占比:{" "}
					<span className="text-primary text-right w-8 font-bold">
						{Math.round((totalWeight / 1000) * 1000)}%
					</span>
				</div>
			),
			size: 80,
			maxSize: 80,
			cell: ({ row }) => {
				return (
					<EditableNumberCell
						className="w-24 pr-1"
						disabled={isAutoRocket}
						value={row.original.cap_weight ?? 0}
						onChange={async (newValue) => {
							if (fusionIndex === -1) {
								updateSelectStg(row.index, {
									...selectStgList[row.index],
									cap_weight: newValue,
								})
							} else {
								updateFusionStgInRow(
									fusionIndex,
									{ cap_weight: newValue },
									row.original,
									row.index,
								)
							}
						}}
					/>
				)
			},
		},
		{
			accessorKey: "name",
			// size: 100,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="策略名称" />
			),
			cell: ({ row }) => {
				if (row.original.cap_weight >= 0) {
					return (
						<div className="flex items-center gap-1">
							{!isDisabled && (
								<Badge variant="secondary" className="shrink-0 p-1">
									<CheckCircledIcon className="size-4 mr-1 text-success" />{" "}
									<span>实盘</span>
								</Badge>
							)}
							<span className="text-nowrap">{row.original.name}</span>
						</div>
					)
				}

				return <div>{row.original.name}</div>
			},
		},
		{
			accessorKey: "select_num",
			header: "选股数量",
			size: 60,
			enableResizing: false,
		},
		{
			accessorKey: "hold_period",
			header: "持仓周期",
			size: 60,
			enableResizing: false,
		},
		{
			header: "OFFSET",
			accessorKey: "offset_list",
			// size: 120,
			cell: ({ row }) => {
				return (
					<div className="whitespace-pre-wrap break-words truncate max-w-[260px]">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="truncate">
									{(row.original as SelectStgType).offset_list &&
									(row.original as SelectStgType).offset_list.length > 0
										? (row.original as SelectStgType).offset_list.join(",")
										: "--"}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								{(row.original as SelectStgType).offset_list &&
									(row.original as SelectStgType).offset_list.join(",")}
							</TooltipContent>
						</Tooltip>
					</div>
				)
			},
		},
		{
			accessorKey: "rebalance_time",
			header: "换仓时间",
			cell: ({ row }) => {
				return (
					<div>
						{getRebalanceTime(
							(row.original as SelectStgType).rebalance_time ?? "close-open",
						)}
					</div>
				)
			},
		},
		{
			accessorKey: "timing",
			header: "择时",
			cell: ({ row }) => {
				return <div>{(row.original as SelectStgType).timing?.name ?? "无"}</div>
			},
		},
		{
			id: "action",
			size: 50,
			maxSize: 80,
			header: "操作",
			cell: ({ row }) => {
				return isAutoRocket ? (
					<Badge variant="secondary">实盘中</Badge>
				) : (
					<div className="flex items-center gap-1">
						<StrategyEditDialog
							strategy={row.original as SelectStgType}
							rowIndex={row.index}
							fusionIndex={fusionIndex}
						/>
						{!isDisabled && (
							<DeleteStrategy
								strategy={row.original as SelectStgType}
								rowIndex={row.index}
								strategyType="select"
								onSuccess={refresh}
								className="!relative !inset-auto"
							/>
						)}
					</div>
				)
			},
		},
	]
}
