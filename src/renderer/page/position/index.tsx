/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import LoadingAnime from "@/renderer/components/LoadingAnime"
import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import { DataTable } from "@/renderer/components/ui/data-table"
import { DataTableToolbar } from "@/renderer/components/ui/data-table-toolbar"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import { H2 } from "@/renderer/components/ui/typography"
import { usePermissionCheck } from "@/renderer/hooks"
import { DataTableActionOptionsProps } from "@/renderer/page/data/table/options"
import { usePositionInfoColumns } from "@/renderer/page/position/columns"
import { PositionInfoType } from "@/renderer/page/position/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FolderIcon } from "lucide-react"

const { execFuelWithEnv, selectDirectory, loadPosition } = window.electronAPI

// -- 提取导入持仓信息的逻辑为自定义 hook
function useImportPosition(onSuccess: () => void) {
	return useMutation({
		mutationKey: ["import-position"],
		mutationFn: async (dirPath: string) =>
			await execFuelWithEnv(["load", "old"], `导入持仓文件`, "rocket", dirPath),
		onSuccess,
	})
}

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

	const { mutateAsync: importPosition, isPending: importPositionLoading } =
		useImportPosition(() => {
			refetch()
		})

	return (
		<div className="flex flex-col h-full gap-4">
			<div className="flex flex-col mb-4">
				<H2>持仓信息</H2>
				<p className="text-muted-foreground">
					当前实盘账户中，各个策略的持仓明细
				</p>
			</div>

			<LoadingAnime
				loading={importPositionLoading}
				content="导入并解析持仓信息文件中..."
			/>
			<ScrollArea className="h-full">
				<div className="space-y-4">
					<DataTable<PositionInfoType, unknown>
						data={positions || []}
						columns={columns}
						loading={loading}
						refresh={() => {
							refetch()
						}}
						pagination={false}
						placeholder="查找所有列..."
						actionOptions={(props) => (
							<PositionInfoTableToolbar
								{...props}
								importPosition={importPosition}
							/>
						)}
					/>
				</div>
			</ScrollArea>
		</div>
	)
}

// -- 修改 PositionInfoTableToolbar 组件，接收 importPosition 函数作为 prop
const PositionInfoTableToolbar = ({
	refresh,
	importPosition,
	...props
}: DataTableActionOptionsProps<any> & {
	importPosition: (dirPath: string) => Promise<{
		code: number
		message: string
	}>
}) => {
	const { check } = usePermissionCheck()
	const handleImport = async () => {
		// -- 权限检查
		if (
			!check({ requireMember: true, windowsOnly: true, onlyIn2025: true })
				.isValid
		) {
			return
		}

		const res = await selectDirectory()
		if (res) {
			await importPosition(res as string)
		}
	}

	return (
		<DataTableToolbar {...props}>
			<Button
				size="sm"
				variant="outline"
				className="h-8 text-foreground lg:flex"
				onClick={handleImport}
			>
				<FolderIcon className="mr-2 h-4 w-4" /> 导入持仓文件夹
			</Button>

			<span className="text-sm text-muted-foreground">
				请选择 <Badge>rocket/data/账户信息</Badge> 文件夹
			</span>
		</DataTableToolbar>
	)
}
