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
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import { H2, H3 } from "@/renderer/components/ui/typography"
import { changelogs, typeIconMap } from "@/renderer/page/info/constant"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function ChangeLogs() {
	const [showScrollTop, setShowScrollTop] = useState(false)

	// -- 监听滚动事件
	useEffect(() => {
		const handleScroll = (e: Event) => {
			const target = e.target as HTMLDivElement
			setShowScrollTop(target.scrollTop > 100)
		}

		const scrollArea = document.querySelector(
			".main-content [data-radix-scroll-area-viewport]",
		)
		scrollArea?.addEventListener("scroll", handleScroll)

		return () => {
			scrollArea?.removeEventListener("scroll", handleScroll)
		}
	}, [])

	// -- 回到顶部
	const scrollToTop = () => {
		const scrollAreas = document.querySelectorAll(
			"[data-radix-scroll-area-viewport]",
		)
		scrollAreas.forEach((area) => {
			area.scrollTo({ top: 0, behavior: "smooth" })
		})
	}

	// -- 跳转到指定版本
	const scrollToVersion = (version: string) => {
		const element = document.getElementById(`version-${version}`)
		element?.scrollIntoView({ behavior: "smooth" })
	}

	return (
		<div className="h-full flex gap-8">
			{/* 侧边导航栏 */}
			<div className="hidden lg:block w-24 space-y-1 h-full">
				<div className="fixed w-24 h-full">
					<div
						className="font-medium mb-2 hover:cursor-pointer"
						onClick={scrollToTop}
					>
						版本列表
					</div>
					<ScrollArea className="h-[calc(100%-14rem)]">
						<div className="space-y-1">
							{changelogs.map((log) => (
								<button
									key={log.version}
									className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground"
									onClick={() => scrollToVersion(log.version)}
								>
									{log.version}
								</button>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>

			{/* 主内容区 */}
			<ScrollArea className="h-full relative flex-1 main-content">
				<div className="h-full flex-1 flex-col space-y-8 md:flex">
					<div className="flex items-center justify-between space-y-2">
						<div>
							<H2>更新日志</H2>
							<p className="text-muted-foreground">
								记录了客户端各个版本的更新日志。
							</p>
						</div>
					</div>

					<div className="flex flex-col space-y-4">
						{changelogs.map((changelog) => (
							<div
								key={changelog.version}
								id={`version-${changelog.version}`}
								className="flex flex-col space-y-2"
							>
								<H3>{changelog.version}</H3>
								<div className="flex flex-col space-y-2">
									{changelog.changes.map((change) => (
										<div key={change.type} className="flex items-center">
											<span className="text-muted-foreground w-6">
												{typeIconMap[change.type]}
											</span>
											<span className="text-foreground w-16">
												{change.type}
											</span>
											<span className="text-muted-foreground">
												{change.description}
											</span>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{showScrollTop && (
					<ButtonTooltip content="回到顶部">
						<Button
							variant="secondary"
							size="icon"
							className="fixed bottom-16 right-16 rounded-full shadow-lg"
							onClick={scrollToTop}
						>
							<ArrowUp className="h-4 w-4" />
						</Button>
					</ButtonTooltip>
				)}
			</ScrollArea>
		</div>
	)
}
