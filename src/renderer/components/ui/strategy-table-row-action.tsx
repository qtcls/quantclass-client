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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog"
import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import {
	IStrategyList,
	StrategyListSchema,
} from "@/renderer/page/subscription/stg-schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"
import { Row } from "@tanstack/react-table"
import { BookText, Delete } from "lucide-react"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { z } from "zod"

const { getStoreValue, setStoreValue } = window.electronAPI

export interface IStrategyTableRowActionsProps {
	row: Row<IStrategyList>
	refresh: () => void
}

export function StrategyTableRowActions({
	row,
	refresh,
}: IStrategyTableRowActionsProps) {
	const [stockOpen, setStockOpen] = useState(false)
	const [open, setOpen] = useState(false)
	const task = StrategyListSchema.parse(row.original)

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 text-muted-foreground data-[state=open]:bg-muted"
					>
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuItem
						className="hover:cursor-pointer"
						disabled={task.info?.selected_strategy === "空仓"}
						onClick={() => setStockOpen(true)}
					>
						<BookText size={14} className="mr-2" /> 展示选股结果
					</DropdownMenuItem>

					<DropdownMenuItem
						className="hover:cursor-pointer"
						onClick={() => setOpen(true)}
					>
						<Delete size={14} className="mr-2" /> 删除该策略
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertStockRes open={stockOpen} setOpen={setStockOpen}>
				<div className="grid grid-cols-3 gap-x-2 gap-y-1">
					{!row.original.result
						? "-"
						: row.original.result
								.map((item) => `${item.name}-${item.symbol}`)
								.join(";")
								.split(";")
								.map((item) => (
									<Badge key={item} className="block">
										{item}
									</Badge>
								))}
				</div>
			</AlertStockRes>
			<AlertRemoveStrategy
				task={task}
				open={open}
				setOpen={setOpen}
				refresh={refresh}
			/>
		</>
	)
}

const AlertStockRes = ({
	open,
	setOpen,
	children,
}: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	children: ReactNode
}) => {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>选股结果</AlertDialogTitle>

					<AlertDialogDescription>{children}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen((p) => !p)}>
						关闭
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

const AlertRemoveStrategy = ({
	task,
	open,
	setOpen,
	refresh,
}: {
	task: z.infer<typeof StrategyListSchema>
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	refresh: () => void
}) => {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>删除后不可撤销</AlertDialogTitle>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen((p) => !p)}>
						再想想
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							let strategy_map = (await getStoreValue(
								"strategy_map",
								[],
							)) as Array<{
								key: string
								value: string
							}>
							let strategy_white_list = (await getStoreValue(
								"settings.strategy_white_list",
								[],
							)) as string[]
							strategy_map = strategy_map.filter(
								(item) => item.key !== task.key,
							)
							strategy_white_list = strategy_white_list.filter(
								(item) => item !== task.key,
							)

							setStoreValue("strategy_map", strategy_map)
							setStoreValue("settings.strategy_white_list", strategy_white_list)

							refresh()

							setOpen((p) => !p)
						}}
					>
						确认删除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
