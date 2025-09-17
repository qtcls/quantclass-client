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
import { CircleCheck } from "lucide-react"
import { useAlertDialog } from "../context/alert-dialog"
import { useFusionManager } from "../hooks/useFusionManager"
import { useSettings } from "../hooks/useSettings"
import { useStrategyManager } from "../hooks/useStrategyManager"
import { Badge } from "./ui/badge"
export function ChangeLibrary({
	currentLibraryType,
}: { currentLibraryType: string }) {
	const { settings, isFusionMode, updateSettings } = useSettings()
	const { isAutoRocket } = useToggleAutoRealTrading()
	const { open: openAlert } = useAlertDialog()
	const { resetSelectStgList } = useStrategyManager()
	const { resetFusion } = useFusionManager()

	const { restartApp } = window.electronAPI

	const handleChangeLibrary = () => {
		openAlert({
			title: "确认切换策略库吗？",
			content: (
				<ul className="list-disc list-inside pl-4">
					<li>切换之后会清空所有数据</li>
					<li>
						切换操作需要{" "}
						<span className="font-bold text-warning">重启应用程序</span>{" "}
						才能生效
					</li>
				</ul>
			),
			okText: "立即切换，并重启",
			okDelay: 5,
			onOk: async () => {
				// 清理老的策略文件们
				isFusionMode ? resetFusion() : resetSelectStgList()

				updateSettings({ libraryType: isFusionMode ? "select" : "pos" })

				// 重启应用程序
				restartApp()
				// toast.success(`策略库切换成功`)
			},
		})
	}

	return (
		<>
			{currentLibraryType === settings.libraryType ? (
				<div className="flex items-center gap-2 text-sm">
					<Badge variant="info" className="py-1 px-1.5 flex items-center gap-1">
						<CircleCheck size={14} />
						<span>已启用</span>
					</Badge>
					<span className="text-blue-600 dark:text-blue-400">
						客户端会使用当前策略库中的配置进行回测和实盘
					</span>
				</div>
			) : (
				<div className="flex items-center gap-2 border border-warning-200 bg-warning-50 text-warning rounded-lg px-2 py-1.5">
					<Button
						disabled={isAutoRocket}
						onClick={handleChangeLibrary}
						size="sm"
						variant="ringHover"
						className="h-7 w-16"
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
