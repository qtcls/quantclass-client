/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { DataTable } from "@/renderer/components/ui/data-table"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import { H2 } from "@/renderer/components/ui/typography"
import { usePermissionCheck } from "@/renderer/hooks"
import { usePositionInfoColumns } from "@/renderer/page/position/columns"
import { PositionInfoType } from "@/renderer/page/position/types"
import { Tabs, TabsList, TabsTrigger } from "@/renderer/components/ui/tabs"
import { useMutation, useQuery } from "@tanstack/react-query"

const { loadPosition } = window.electronAPI

// // -- 提取导入持仓信息的逻辑为自定义 hook
// function useImportPosition(onSuccess: () => void) {
// 	return useMutation({
// 		mutationKey: ["import-position"],
// 		mutationFn: async (dirPath: string) =>
// 			await execFuelWithEnv(["load", "old"], `导入持仓文件`, "rocket", dirPath),
// 		onSuccess,
// 	})
// }

export default function PositionInfo() {
	const columns = usePositionInfoColumns()
	const {
		data: positions = [],
		isLoading: loading,
		refetch,
	} = useQuery({
		queryKey: ["load-positions"],
		queryFn: loadPosition,
		retry: false,
		refetchInterval: 1000 * 90,
	})

	return (
		<div className="flex flex-col h-full gap-3 py-3">
			<div
				className="flex items-center gap-2 px-4 py-2 mb-2 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200"
				role="alert"
			>
				<svg
					className="w-5 h-5 shrink-0 text-yellow-500 dark:text-yellow-300"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 8v4m0 4h.01"
					/>
				</svg>
				<span className="text-sm font-medium">
					该页面为未正式发布版本，没有实现功能，仅供参考。
				</span>
			</div>
			<div className="flex flex-col">
				<H2>持仓信息</H2>
				<p className="text-muted-foreground">
					当前实盘账户中，各个策略的持仓明细
				</p>
			</div>
			<ScrollArea className="h-full">
				<div className="space-y-2">
					<Tabs defaultValue="strategy">
						<TabsList>
							<TabsTrigger value="strategy">策略视图</TabsTrigger>
							<TabsTrigger value="stock">个股视图</TabsTrigger>
						</TabsList>
					</Tabs>
					<DataTable<PositionInfoType, unknown>
						data={positions || []}
						columns={columns}
						loading={loading}
						refresh={() => {
							refetch()
						}}
						pagination={false}
						placeholder="查找所有列..."
					/>
				</div>
			</ScrollArea>
		</div>
	)
}
