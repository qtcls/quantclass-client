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
import ButtonTooltip from "@/renderer/components/ui/button-tooltip"
import { H3, H4 } from "@/renderer/components/ui/typography"
import { DATA_PAGE } from "@/renderer/constant"
import {
	useAuthUpdate,
	useHandleTimeTask,
	useScheduleTimes,
} from "@/renderer/hooks"
import { isUpdatingAtom } from "@/renderer/store"

import { DataLocationCtrl } from "@/renderer/components/data-location-ctrl"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/renderer/components/ui/dialog"
import { useDataSubscribed } from "@/renderer/hooks/useDataSubscribed"
import { useAtomValue } from "jotai"
import { Database, Play, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { accountKeyAtom } from "../../store/storage"

export const DataKanban = () => {
	const disabled = useAuthUpdate()
	const navigate = useNavigate()
	const [confirmStartAutoUpdate, setConfirmStartAutoUpdate] = useState(false)
	const { apiKey, uuid } = useAtomValue(accountKeyAtom)
	const isUpdating = useAtomValue(isUpdatingAtom)
	const { dataScheduleTimes } = useScheduleTimes()
	const { dataSubscribedNameList } = useDataSubscribed()
	const handleTimeTask = useHandleTimeTask()

	useEffect(() => {
		if (apiKey === "" && uuid === "" && isUpdating) {
			handleTimeTask(true)
		}
	}, [apiKey, uuid])

	return (
		<>
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Database size={26} />
						<H3>数据中心</H3>
					</div>
					{isUpdating ? (
						<ButtonTooltip content="停止自动更新数据">
							<Button
								variant={dataScheduleTimes.length > 0 ? "warning" : "success"}
								className="hover:cursor-pointer"
								disabled={disabled}
								onClick={() => handleTimeTask(true)}
							>
								<RefreshCcw className="size-4 animate-spin mr-2" />
								暂停
							</Button>
						</ButtonTooltip>
					) : (
						<ButtonTooltip content="启动自动更新数据">
							<Button
								className="hover:cursor-pointer"
								onClick={() => {
									setConfirmStartAutoUpdate(true)
								}}
							>
								<Play className="mr-2 size-4" />
								启动
							</Button>
						</ButtonTooltip>
					)}
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					订阅数据情况：
					<Button
						variant="link"
						className="font-bold p-1 h-6"
						onClick={() => navigate(DATA_PAGE)}
					>
						{dataSubscribedNameList.length ?? 0} 份
					</Button>
				</div>

				<div className="bg-card rounded-lg p-3 shadow-sm border max-w-3xl">
					<H4 className="mb-4">
						存储路径{" "}
						<span className="text-muted-foreground text-sm">
							建议预留最少 20GB 空间
						</span>
					</H4>
					<div className="flex items-center gap-2 w-full">
						<DataLocationCtrl className="min-w-64" />
					</div>
				</div>
			</div>
			<Dialog
				open={confirmStartAutoUpdate}
				onOpenChange={(value) => setConfirmStartAutoUpdate(value)}
			>
				<DialogContent className="max-w-lg p-4">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Play size={20} />
							启动自动更新数据
						</DialogTitle>
					</DialogHeader>
					<div className="text-primary">
						启动后，会<span className="font-bold"> 实时检查 </span>并
						<span className="font-bold"> 更新数据 </span>
						，自动完成数据的处理与存储，尽量保证本地数据是最新的。
					</div>
					<DialogFooter>
						<Button
							className="hover:cursor-pointer w-full"
							variant="success"
							onClick={async () => {
								await handleTimeTask(false)
								setConfirmStartAutoUpdate(false)
							}}
						>
							<Play className="mr-2 size-4" />
							启动
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
