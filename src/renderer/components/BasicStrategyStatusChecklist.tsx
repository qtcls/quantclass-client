/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/renderer/components/ui/card"
import DatePicker from "@/renderer/components/ui/date-picker"
import { cn } from "@/renderer/lib/utils"
import {
	selectedDateAtom,
	strategyStatusAtom,
} from "@/renderer/store/strategy-status"
import type {
	StrategyStatus,
	StrategyStatusTag,
} from "@/shared/types/strategy-status"
import {
	StrategyStatusEnum,
	StrategyStatusLabelEnum,
} from "@/shared/types/strategy-status"
import { ReloadIcon, ValueNoneIcon } from "@radix-ui/react-icons"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { Check, CircleAlert, Clock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// -- 逐个打勾的间隔（毫秒）
const REVEAL_STEP_MS = 900
const REVEAL_INITIAL_DELAY_MS = 400

// -- 基础版只关心这五个节点，按执行顺序排列
const CHECKLIST_TAGS: { tag: StrategyStatusTag; label: string }[] = [
	{ tag: "SELECT_CLOSE", label: "选股" },
	{ tag: "TRADE_SELL_PLAN", label: "生成卖出计划" },
	{ tag: "TRADE_BUY_PLAN", label: "生成买入计划" },
	{ tag: "TRADE_SELL", label: "实盘卖出" },
	{ tag: "TRADE_BUY", label: "实盘买入" },
]

const overallBadgeStyle: Record<StrategyStatusEnum, string> = {
	[StrategyStatusEnum.COMPLETED]:
		"bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-200 border-green-200 dark:border-green-700",
	[StrategyStatusEnum.INCOMPLETE]:
		"bg-amber-50 dark:bg-amber-800 text-amber-600 dark:text-amber-200 border-amber-200 dark:border-amber-700",
	[StrategyStatusEnum.IN_PROGRESS]:
		"bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 border-blue-200 dark:border-blue-700",
	[StrategyStatusEnum.PENDING]:
		"bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-700",
}

interface ChecklistNode {
	tag: StrategyStatusTag
	label: string
	status: StrategyStatusEnum
	doneTime: [Date, Date | null] | null
}

function getStatTime(item: StrategyStatus | undefined): [Date, Date | null] | null {
	return item?.stat?.time ?? null
}

function formatStatTimeRange(
	time: [Date, Date | null] | null | undefined,
): string | null {
	if (!time?.[0]) return null
	const start = dayjs(time[0])
	if (!start.isValid()) return null
	if (time[1]) {
		const end = dayjs(time[1])
		if (end.isValid()) {
			return `${start.format("HH:mm:ss")}\n至 ${end.format("HH:mm:ss")}`
		}
	}
	return `${start.format("HH:mm:ss")}\n至 --- ---`
}

function buildNodes(strategy: StrategyStatus[]): ChecklistNode[] {
	return CHECKLIST_TAGS.map(({ tag, label }) => {
		const item = strategy.find((s) => s.tag === tag)
		return {
			tag,
			label,
			status: item?.status ?? StrategyStatusEnum.PENDING,
			doneTime: getStatTime(item),
		}
	})
}

function getOverallStatus(nodes: ChecklistNode[]): StrategyStatusEnum {
	const statuses = nodes.map((n) => n.status)
	if (statuses.every((s) => s === StrategyStatusEnum.COMPLETED)) {
		return StrategyStatusEnum.COMPLETED
	}
	if (statuses.includes(StrategyStatusEnum.IN_PROGRESS)) {
		return StrategyStatusEnum.IN_PROGRESS
	}
	if (statuses.includes(StrategyStatusEnum.INCOMPLETE)) {
		return StrategyStatusEnum.INCOMPLETE
	}
	return StrategyStatusEnum.PENDING
}

// -- 单个节点：根据状态与是否已“揭示打勾”渲染不同图标
function NodeIcon({
	status,
	revealed,
}: {
	status: StrategyStatusEnum
	revealed: boolean
}) {
	if (status === StrategyStatusEnum.COMPLETED && revealed) {
		return (
			<motion.span
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					type: "spring",
					stiffness: 280,
					damping: 18,
				}}
				className="grid size-6 place-items-center rounded-full border border-green-500 bg-green-500 text-white"
			>
				<motion.span
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 16,
						delay: 0.18,
					}}
					className="grid place-items-center"
				>
					<Check className="size-4" strokeWidth={3} />
				</motion.span>
			</motion.span>
		)
	}

	if (status === StrategyStatusEnum.COMPLETED) {
		// 已完成但尚未揭示：先显示灰色占位，等待逐个打勾
		return (
			<span className="grid size-6 place-items-center rounded-full border border-dashed border-gray-300 dark:border-gray-600">
				<span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
			</span>
		)
	}

	if (status === StrategyStatusEnum.IN_PROGRESS) {
		return (
			<span className="grid size-6 place-items-center rounded-full border border-blue-500 text-blue-500">
				<Loader2 className="size-4 animate-spin" />
			</span>
		)
	}

	if (status === StrategyStatusEnum.INCOMPLETE) {
		return (
			<span className="grid size-6 place-items-center rounded-full border border-amber-500 text-amber-500">
				<CircleAlert className="size-4" />
			</span>
		)
	}

	return (
		<span className="grid size-6 place-items-center rounded-full border border-dashed border-gray-300 dark:border-gray-600">
			<span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
		</span>
	)
}

function WorkflowConnector({ active }: { active: boolean }) {
	return (
		<div className="relative mx-1 h-px min-w-6 flex-1 self-start mt-3">
			<div className="absolute inset-0 bg-border" />
			<motion.div
				className="absolute inset-y-0 left-0 bg-green-500"
				initial={{ width: "0%" }}
				animate={{ width: active ? "100%" : "0%" }}
				transition={{ duration: 0.45, ease: "easeOut" }}
			/>
		</div>
	)
}

// -- 单个策略的工作流行，负责一个个“打勾”的动态揭示
function StrategyChecklistRow({
	index,
	strategy,
	isNonTradingDay,
}: {
	index: number
	strategy: StrategyStatus[]
	isNonTradingDay: boolean
}) {
	const nodes = buildNodes(strategy)
	const strategyName = strategy[0]?.strategyName || `策略 ${index + 1}`
	const capWeight = strategy[0]?.capWeight ?? 1
	const isNotReal = capWeight === 0

	const completedIndices = nodes
		.map((n, i) => (n.status === StrategyStatusEnum.COMPLETED ? i : -1))
		.filter((i) => i >= 0)
	const doneCount = completedIndices.length

	const [revealedCount, setRevealedCount] = useState(0)

	useEffect(() => {
		setRevealedCount(0)
		let current = 0
		let cancelled = false
		let stepTimer: ReturnType<typeof setTimeout> | undefined

		const initialTimer = setTimeout(() => {
			const revealNext = () => {
				if (cancelled) return
				current += 1
				setRevealedCount(current)
				if (current < doneCount) {
					stepTimer = setTimeout(revealNext, REVEAL_STEP_MS)
				}
			}
			if (doneCount > 0) revealNext()
		}, REVEAL_INITIAL_DELAY_MS)

		return () => {
			cancelled = true
			clearTimeout(initialTimer)
			if (stepTimer) clearTimeout(stepTimer)
		}
	}, [doneCount])

	const overall = getOverallStatus(nodes)
	const revealedDone = completedIndices.slice(0, revealedCount)
	const progress = isNonTradingDay || isNotReal ? 0 : revealedDone.length
	const displayOverall =
		overall === StrategyStatusEnum.COMPLETED && revealedCount < doneCount
			? StrategyStatusEnum.IN_PROGRESS
			: overall

	return (
		<div className="border-b last:border-b-0 py-4">
			<div className="mb-4 flex items-center gap-2">
				<span className="flex-shrink-0 font-medium">
					{index + 1}. {strategyName}
				</span>
				<Badge
					variant="outline"
					className={cn(
						"text-xs px-2 py-0.5",
						isNonTradingDay || isNotReal
							? overallBadgeStyle[StrategyStatusEnum.PENDING]
							: overallBadgeStyle[displayOverall],
					)}
				>
					{isNonTradingDay
						? "非交易日"
						: isNotReal
							? "非实盘"
							: StrategyStatusLabelEnum[displayOverall]}
				</Badge>
				<span className="ml-auto text-xs text-muted-foreground font-mono">
					{progress}/{CHECKLIST_TAGS.length}
				</span>
			</div>

			<div className="flex items-start">
				{nodes.map((node, i) => {
					const isRevealedDone =
						node.status === StrategyStatusEnum.COMPLETED &&
						revealedDone.includes(i)
					const displayStatus =
						node.status === StrategyStatusEnum.COMPLETED && !isRevealedDone
							? StrategyStatusEnum.PENDING
							: node.status
					const connectorActive =
						isRevealedDone &&
						i < nodes.length - 1 &&
						revealedDone.includes(i + 1)

					return (
						<div key={node.tag} className="flex min-w-0 flex-1 items-start">
							<motion.div
								className="flex w-full min-w-0 flex-col items-center gap-1.5 px-1 text-center"
								animate={{
									opacity: isRevealedDone
										? 1
										: displayStatus === StrategyStatusEnum.PENDING
											? 0.65
											: 1,
								}}
								transition={{ duration: 0.25 }}
							>
								<NodeIcon status={node.status} revealed={isRevealedDone} />
								<span
									className={cn(
										"text-sm leading-tight transition-colors duration-300",
										isRevealedDone
											? "text-foreground font-medium"
											: displayStatus === StrategyStatusEnum.IN_PROGRESS
												? "text-blue-600 dark:text-blue-300"
												: displayStatus === StrategyStatusEnum.INCOMPLETE
													? "text-amber-600 dark:text-amber-300"
													: "text-muted-foreground",
									)}
								>
									{node.label}
								</span>
								{isRevealedDone && node.doneTime && (
									<motion.span
										initial={{ opacity: 0, y: 4 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.35, delay: 0.12 }}
										className="whitespace-pre-line text-[11px] leading-tight text-muted-foreground font-mono"
									>
										{formatStatTimeRange(node.doneTime)}
									</motion.span>
								)}
								{displayStatus === StrategyStatusEnum.IN_PROGRESS &&
									node.doneTime && (
										<span className="whitespace-pre-line text-[11px] leading-tight text-muted-foreground font-mono">
											{formatStatTimeRange(node.doneTime)}
										</span>
									)}
								{displayStatus === StrategyStatusEnum.INCOMPLETE && (
									<span className="text-[11px] leading-tight text-amber-600 dark:text-amber-300">
										异常
									</span>
								)}
							</motion.div>
							{i < nodes.length - 1 && (
								<WorkflowConnector active={connectorActive} />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default function BasicStrategyStatusChecklist() {
	const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
	const [{ data: strategyStatusData, refetch }] = useAtom(strategyStatusAtom)

	const displayDate =
		selectedDate ||
		dayjs(new Date(new Date().getTime() + 8.5 * 60 * 60 * 1000)).format(
			"YYYY-MM-DD",
		)
	const isCurrentDay =
		!selectedDate ||
		selectedDate ===
			dayjs(new Date(new Date().getTime() + 8.5 * 60 * 60 * 1000)).format(
				"YYYY-MM-DD",
			)
	const isNonTradingDay =
		dayjs(displayDate).day() === 0 || dayjs(displayDate).day() === 6

	const handleDateChange = (date: Date | undefined) => {
		setSelectedDate(date ? dayjs(date).format("YYYY-MM-DD") : "")
	}

	return (
		<Card className="w-full">
			<CardHeader className="border-b px-4 py-3">
				<CardTitle className="pt-0 mt-0 flex flex-row justify-between items-center gap-1">
					<div className="flex items-center flex-wrap gap-2">
						<Clock className="w-5 h-5" />
						策略实盘状态
					</div>
					<div className="flex gap-2 flex-wrap justify-end">
						<Button
							size="sm"
							className="h-8"
							variant={isCurrentDay ? "default" : "outline"}
							onClick={() => {
								setSelectedDate(undefined)
								refetch()
								toast.success("策略实盘状态信息刷新成功")
							}}
						>
							今天
						</Button>
						<DatePicker
							className="w-42 h-8"
							value={
								selectedDate
									? new Date(selectedDate)
									: new Date(new Date().getTime() + 8.5 * 60 * 60 * 1000)
							}
							onChange={handleDateChange}
						/>
						<Button
							size="sm"
							className="h-8"
							variant="outline"
							onClick={() => {
								refetch()
								toast.success("策略实盘状态信息刷新成功")
							}}
						>
							<ReloadIcon className="mr-2 h-4 w-4" />
							刷新
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{strategyStatusData && strategyStatusData.length > 0 ? (
					<div>
						{strategyStatusData.map((strategy, index) => (
							<StrategyChecklistRow
								key={strategy[0]?.strategyName ?? index}
								index={index}
								strategy={strategy}
								isNonTradingDay={isNonTradingDay}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-1 pt-4 items-center justify-center">
						<ValueNoneIcon className="h-10 w-10 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">暂无数据</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
