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
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog"
import { Button } from "@/renderer/components/ui/button"
import { useFusionManager } from "@/renderer/hooks/useFusionManager"
import { useStrategyManager } from "@/renderer/hooks/useStrategyManager"
import { libraryShowAtom, libraryTypeAtom } from "@/renderer/store/storage"
import { useAtom } from "jotai"
import { OctagonAlert } from "lucide-react"
export function ConfirmChangeLibrary() {
	const [libraryType, setLibraryType] = useAtom(libraryTypeAtom)
	const [libraryShow, setLibraryShow] = useAtom(libraryShowAtom)
	const { resetSelectStgList } = useStrategyManager()
	const { resetFusion } = useFusionManager()

	const { setStoreValue, restartApp } = window.electronAPI

	return (
		<div>
			<AlertDialog open={libraryShow} onOpenChange={setLibraryShow}>
				<AlertDialogContent className="p-4">
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center">
							<OctagonAlert className="mr-2" /> 确认切换策略库吗？
						</AlertDialogTitle>
						<AlertDialogDescription className="py-1 leading-loose">
							<span>※ 切换之后会清空所有数据，</span>
							<br />
							<span>※ 切换操作需要重启应用程序才能生效</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>取消</AlertDialogCancel>
						<Button
							variant={"destructive"}
							onClick={async () => {
								const targetLibraryType =
									libraryType === "select" ? "pos" : "select"
								if (libraryType === "select") {
									// 需要清空选股策略
									resetSelectStgList()
								} else {
									// 需要清理仓位管理策略，zym写的不行，只能自己手搓
									resetFusion()
								}
								setLibraryType(targetLibraryType)
								setStoreValue("settings.libraryType", targetLibraryType)
								setLibraryShow(false)

								// 重启应用程序
								restartApp()
								// toast.success(`策略库切换成功`)
							}}
						>
							确定
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
