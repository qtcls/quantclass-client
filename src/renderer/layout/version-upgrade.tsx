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
import { versionListAtom } from "@/renderer/store/storage"
import { useAtom } from "jotai"
import {
	ArrowRight,
	ChevronRight,
	CircleCheckBig,
	Sparkles,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog"

interface VersionTip {
	title: string
	describe: string
}

interface VersionData {
	version: string
	versionTipsList: VersionTip[]
}

// 解析 Markdown 格式的更新日志
const parseChangelog = (content: string): VersionData[] => {
	const versions: VersionData[] = []
	const lines = content.split("\n")

	let currentVersion = ""
	let currentTips: VersionTip[] = []

	for (const line of lines) {
		// 匹配版本号 ## [3.4.0] - 2025-01-XX
		const versionMatch = line.match(/^## \[([^\]]+)\]/)
		if (versionMatch) {
			// 保存前一个版本的数据
			if (currentVersion && currentTips.length > 0) {
				versions.push({
					version: currentVersion,
					versionTipsList: [...currentTips],
				})
			}

			currentVersion = versionMatch[1]
			currentTips = []
			continue
		}

		// 跳过分类标题 ### 新增功能
		if (line.match(/^### (.+)/)) {
			continue
		}

		// 匹配具体项目 - 🚫 **添加实盘买入黑名单功能** - 描述内容
		const itemMatch = line.match(/^- (.+?) \*\*(.+?)\*\* - (.+)/)
		if (itemMatch) {
			const emoji = itemMatch[1].trim()
			const title = itemMatch[2].trim()
			const description = itemMatch[3].trim()

			currentTips.push({
				title: `${emoji} ${title}`,
				describe: description,
			})
		}
	}

	// 保存最后一个版本的数据
	if (currentVersion && currentTips.length > 0) {
		versions.push({
			version: currentVersion,
			versionTipsList: [...currentTips],
		})
	}

	return versions
}

export default function VersionUpgrade() {
	const [versionList, setVersionList] = useAtom(versionListAtom)
	const [data, setData] = useState<VersionData[]>([])
	const [loading, setLoading] = useState(true)
	const { openUrl, readChangelog } = window.electronAPI
	useEffect(() => {
		const loadChangelog = async () => {
			try {
				const result = await readChangelog()
				if (result.success) {
					const parsedData = parseChangelog(result.data)
					setData(parsedData)
				} else {
					console.error("Failed to read changelog:", result.error)
					// 如果读取失败，使用默认数据作为备份
					setData([])
				}
			} catch (error) {
				console.error("Error loading changelog:", error)
				setData([])
			} finally {
				setLoading(false)
			}
		}

		loadChangelog()
	}, [])

	const isShow = useMemo(() => {
		return !loading && data.length > 0 && !versionList.includes(data[0].version)
	}, [versionList, data, loading])

	// 筛选出 data 中 version 不在 versionList 里的数据
	const newData = data.filter((v) => !versionList.includes(v.version))

	// 如果正在加载或没有数据，不显示对话框
	if (loading || data.length === 0) {
		return null
	}

	return (
		<div>
			<Dialog
				open={isShow}
				onOpenChange={(value) => {
					if (!value) {
						setVersionList(data.map((item) => item.version))
					}
				}}
			>
				<DialogContent className="p-0 max-w-4xl gap-0">
					<DialogHeader className="p-4">
						<DialogTitle>客户端更新日志</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 overflow-y-auto max-h-[70vh] border-y py-4 px-4">
						{newData.slice(0, 10).map((item, index) => (
							<div className="space-y-2" key={index}>
								<div className="flex items-center gap-3">
									<Sparkles
										size={20}
										className="text-yellow-500 dark:text-yellow-300"
									/>
									<span className="text-xl font-semibold">
										{item.version}版本的新功能
									</span>
								</div>
								<div className="space-y-3">
									{item.versionTipsList.map((tipsItem, tipsIndex) => (
										<div className="flex items-center gap-3" key={tipsIndex}>
											<CircleCheckBig size={32} className="max-w-5" />
											<div className="space-y-1">
												<div className="text-sm font-bold">
													{tipsItem.title}
												</div>
												<div className="text-xs text-muted-foreground">
													{tipsItem.describe}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
						{data.filter((v) => !versionList.includes(v.version)).length >
							10 && (
							<div
								className="flex items-center text-gray-500 justify-center text-sm cursor-pointer"
								onClick={() => {
									openUrl(
										"https://gitee.com/quantclass/quantclass-client/blob/main/CHANGELOG.md",
									)
								}}
							>
								<span>查看完整版本更新记录</span>
								<ArrowRight className="size-4" />
							</div>
						)}
					</div>
					<div className="text-center p-3">
						<Button
							className="line-height-1"
							onClick={() => {
								// 将 data 中的所有版本号存入 versionList
								const newVersionList = data.map((item) => item.version)
								setVersionList(newVersionList)
							}}
						>
							继续 <ChevronRight size={18} />
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
