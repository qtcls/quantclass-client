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
import { Input } from "@/renderer/components/ui/input"
import { useDataSubscribed } from "@/renderer/hooks/useDataSubscribed"
import { cn } from "@/renderer/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUp, FolderOpen, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useSettings } from "../hooks/useSettings"
import ButtonTooltip from "./ui/button-tooltip"

const { selectDirectory, openDataDirectory } = window.electronAPI

const dataLocationSchema = z.object({
	all_data_path: z.coerce.string(),
})

type DataLocationFormData = z.infer<typeof dataLocationSchema>

export function DataLocationCtrl({ className }: { className?: string }) {
	const [pending, setPending] = useState(false) // 等待IPC调用，有时候windows这个IPC比较慢
	const [choosing, setChoosing] = useState(false) // 是否正在选择文件夹
	const { setDataLocation, dataLocation } = useSettings()
	const { resetDataSubscribed } = useDataSubscribed()
	const form = useForm<DataLocationFormData>({
		mode: "onChange",
		resolver: zodResolver(dataLocationSchema),
	})

	useEffect(() => {
		form.setValue("all_data_path", dataLocation)
	}, [dataLocation])

	const handleFolderSelect = async () => {
		if (choosing) return
		setChoosing(true)
		try {
			const _path = await selectDirectory()
			if (_path) {
				form.setValue("all_data_path", _path, { shouldValidate: true })
				setDataLocation(_path)

				resetDataSubscribed()
				// await startServer()
				toast.success("路径配置成功")
			}
		} finally {
			setChoosing(false)
		}
	}
	return (
		<>
			<div className={cn("relative", className)}>
				<Input
					{...form.register("all_data_path")}
					readOnly
					className="bg-background h-10 overflow-hidden text-ellipsis whitespace-nowrap pr-[4rem]"
					placeholder="请选择数据存储文件夹"
				/>
				<Button
					variant="outline"
					className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 flex items-center justify-center" // 按钮的高度和输入框一致
					disabled={choosing}
					size="sm"
					onClick={handleFolderSelect}
				>
					{dataLocation ? "更改" : "选择"}
				</Button>
				{!dataLocation && (
					<div className="absolute  right-4 top-11 flex items-center gap-1 bg-destructive text-destructive-foreground px-2 py-1 rounded-md animate-pulse">
						<span className="text-sm">请选择</span>
						<ArrowUp size={16} className="animate-bounce" />
					</div>
				)}
			</div>
			<ButtonTooltip content="打开数据文件夹" delayDuration={10}>
				<Button
					size="sm"
					variant="outline"
					className="h-10 text-foreground lg:flex gap-1"
					onClick={async () => {
						setPending(true)
						await openDataDirectory()
						setTimeout(() => setPending(false), 750)
					}}
					disabled={pending}
				>
					{pending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<FolderOpen size={16} />
					)}
				</Button>
			</ButtonTooltip>
		</>
	)
}
