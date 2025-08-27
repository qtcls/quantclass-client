/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { Button } from "@/renderer/components/ui/button"
import { useToggleAutoRealTrading } from "@/renderer/hooks/useToggleAutoRealTrading"
import { libraryTypeAtom } from "@/renderer/store/storage"
import { useAtom } from "jotai"
import { useAlertDialog } from "../context/alert-dialog"
import { useFusionManager } from "../hooks/useFusionManager"
import { useStrategyManager } from "../hooks/useStrategyManager"
import { CircleCheck } from "lucide-react"
import { Badge } from "./ui/badge"
export function ChangeLibrary({
	currentLibraryType,
}: { currentLibraryType: string }) {
	const [libraryType, setLibraryType] = useAtom(libraryTypeAtom)
	const { isAutoRocket } = useToggleAutoRealTrading()
	const { open: openAlert } = useAlertDialog()
	const { resetSelectStgList } = useStrategyManager()
	const { resetFusion } = useFusionManager()

	const { setStoreValue, restartApp } = window.electronAPI

	const handleChangeLibrary = () => {
		openAlert({
			title: "确认切换策略库吗？",
			content: (
				<ul className="list-disc list-inside pl-4">
					<li>切换之后会清空所有数据</li>
					<li>切换操作需要重启应用程序才能生效</li>
				</ul>
			),
			okText: "确认切换",
			onOk: async () => {
				const targetLibraryType = libraryType === "select" ? "pos" : "select"
				if (libraryType === "select") {
					// 需要清空选股策略
					resetSelectStgList()
				} else {
					// 需要清理仓位管理策略，zym写的不行，只能自己手搓
					resetFusion()
				}
				setLibraryType(targetLibraryType)
				setStoreValue("settings.libraryType", targetLibraryType)

				// 重启应用程序
				restartApp()
				// toast.success(`策略库切换成功`)
			},
		})
	}

	return (
		<>
			{currentLibraryType === libraryType ? (
				<div className="flex items-center gap-2 border border-blue-500 bg-blue-50 text-blue-500 rounded-lg p-2 dark:bg-blue-900 dark:border-blue-300 dark:text-blue-300">
					<Badge className="py-1 px-1.5 flex items-center gap-1 bg-blue-500 dark:bg-blue-300">
						<CircleCheck size={14} />
						<span>已启用</span>
					</Badge>

					<span>客户端会使用当前策略库中的配置进行回测和实盘</span>
				</div>
			) : (
				<div className="flex items-center gap-2 border border-warning-500 bg-warning-50 text-warning-500 rounded-lg p-2">
					<Button
						disabled={isAutoRocket}
						onClick={handleChangeLibrary}
						size="sm"
						variant="ringHover"
						className="h-7 w-16 text-sm"
					>
						启用
					</Button>

					<span>
						当前策略库配置未启用，回测和实盘不会使用当前策略库中的策略，但是你依旧可以编辑当前策略库中的策略
					</span>
				</div>
			)}
		</>
	)
}
