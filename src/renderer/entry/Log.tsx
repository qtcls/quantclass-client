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
// import { isWindows } from "@/renderer/constant"
import LogWindowBar from "@/renderer/entry/LogWindowBar"
import { onPythonOutPut, unPythonOutPutListener } from "@/renderer/ipc/listener"
import {
	fuelOutPutAtom,
	realMarketOutputAtom,
	terminalTabAtom,
} from "@/renderer/store"
import dayjs from "dayjs"
import { useAtom } from "jotai"
import { throttle } from "lodash-es"
import { ArrowDown, Trash } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

// const { VITE_XBX_ENV } = import.meta.env

export default function Log() {
	// const [value, toggle] = useToggle(["fuel", "realMarket"])
	const viewportRef = useRef<HTMLDivElement>(null)
	const [output, setOutput] = useAtom(fuelOutPutAtom)
	const [terminalTab, setTerminalTab] = useAtom(terminalTabAtom)
	const [realMarketOutput, setRealMarketOutput] = useAtom(realMarketOutputAtom)
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

	// -- 添加一个标志来追踪是否是程序触发的滚动
	const isAutoScrolling = useRef(false)

	const scrollToBottom = () => {
		if (!shouldAutoScroll) return
		isAutoScrolling.current = true
		const viewport = viewportRef.current
		if (viewport) {
			viewport.scrollTop = viewport.scrollHeight
		}
		// -- 重置标志
		setTimeout(() => {
			isAutoScrolling.current = false
		}, 0)
	}

	const checkIfAtBottom = (viewport: HTMLElement) => {
		return (
			viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 2
		)
	}

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		// -- 如果是程序触发的滚动，不处理
		if (isAutoScrolling.current) return

		const viewport = event.currentTarget
		const atBottom = checkIfAtBottom(viewport)
		setShouldAutoScroll(atBottom)
	}

	const formatOutput = (text: string) => {
		return text
			.split("\n")
			.map((line) => {
				// -- 如果是空行，返回一个小高度的空行
				if (!line.trim()) {
					return '<span class="block leading-[0.5] h-0"></span>'
				}

				// -- 保留前导空格
				const spaces = line.match(/^\s*/)?.[0]?.length || 0
				const spaceString = "&nbsp;".repeat(spaces)

				return `<span class="block leading-5 whitespace-pre">${spaceString}${line.trimLeft()}</span>`
			})
			.join("")
	}

	useEffect(() => {
		unPythonOutPutListener()

		const handler = (output: string, type: "fuel" | "realMarket" = "fuel") => {
			if (type === "fuel") {
				setOutput((currentOutput) => {
					const formattedOutput = formatOutput(output)
					const updatedOutput = currentOutput
						? `${currentOutput}${formattedOutput}`
						: formattedOutput

					// const lines = updatedOutput.split('<span class="block')
					const regex = /(<span[^>]*>.*?<\/span>)/gs
					const lines = updatedOutput.split(regex)
					const maxLines = 1000
					const start = Math.max(0, lines.length - maxLines)
					// const truncatedOutput = lines.slice(start).join('<span class="block')
					const truncatedOutput = lines.slice(start).join("")

					return truncatedOutput
				})
			}

			if (type === "realMarket") {
				setRealMarketOutput((currentOutput) => {
					const formattedOutput = formatOutput(output)
					const updatedOutput = currentOutput
						? `${currentOutput}${formattedOutput}`
						: formattedOutput

					// const lines = updatedOutput.split('<span class="block')
					const regex = /(<span[^>]*>.*?<\/span>)/gs
					const lines = updatedOutput.split(regex)
					const maxLines = 1000
					const start = Math.max(0, lines.length - maxLines)
					// const truncatedOutput = lines.slice(start).join('<span class="block')
					const truncatedOutput = lines.slice(start).join("")

					return truncatedOutput
				})
			}
		}

		onPythonOutPut(handler)

		return () => {
			unPythonOutPutListener()
		}
	}, [shouldAutoScroll])

	useEffect(() => {
		if (shouldAutoScroll) {
			scrollToBottom()
		}
	}, [output, realMarketOutput, shouldAutoScroll, terminalTab])

	const throttledSetTerminalTab = useCallback(
		throttle((tab) => {
			setTerminalTab(tab)
		}, 10000), // 10,000 毫秒，即10秒
		[], // 注意：依赖数组为空，确保 throttle 函数只创建一次
	)

	useEffect(() => {
		throttledSetTerminalTab("realMarket")
	}, [realMarketOutput, throttledSetTerminalTab])

	// useEffect(() => {
	//     throttledSetTerminalTab("fuel")
	// }, [output, throttledSetTerminalTab])

	return (
		<div className="h-screen w-screen">
			<LogWindowBar />

			<div className="flex w-full justify-between h-6 items-center gap-1.5 px-2.5 bg-background border-b border-border">
				<div className="flex gap-4">
					<button
						className={`h-full px-2 text-sm transition-colors relative ${
							terminalTab === "fuel"
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => {
							if (terminalTab === "realMarket") {
								// toggle()
								setTerminalTab("fuel")
								scrollToBottom()
							}
						}}
					>
						数据更新日志
						{terminalTab === "fuel" && (
							<div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground" />
						)}
					</button>
					<button
						className={`h-full px-2 text-sm transition-colors relative ${
							terminalTab === "realMarket"
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => {
							if (terminalTab === "fuel") {
								// toggle()
								setTerminalTab("realMarket")
								scrollToBottom()
							}
						}}
					>
						策略日志
						{terminalTab === "realMarket" && (
							<div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground" />
						)}
					</button>
				</div>

				<div>
					<ButtonTooltip content="清空日志">
						<Button
							size="icon"
							variant="ghost"
							className="my-auto h-5 w-5"
							onClick={() => {
								if (terminalTab === "fuel") {
									setOutput(
										`<span class="block text-center text-muted-foreground">------------------------${dayjs().format(
											"YYYY-MM-DD HH:mm:ss",
										)}------------------------</span>`,
									)
								} else {
									setRealMarketOutput(
										`<span class="block text-center text-muted-foreground">------------------------${dayjs().format(
											"YYYY-MM-DD HH:mm:ss",
										)}------------------------</span>`,
									)
								}
							}}
						>
							<Trash size={16} className="text-muted-foreground" />
						</Button>
					</ButtonTooltip>

					<ButtonTooltip content="滚动到底部">
						<Button
							size="icon"
							variant="ghost"
							className="my-auto h-5 w-5"
							onClick={() => {
								setShouldAutoScroll(true)
								scrollToBottom()
							}}
						>
							<ArrowDown size={16} className="text-muted-foreground" />
						</Button>
					</ButtonTooltip>
				</div>
			</div>

			<div
				id="log-viewport"
				ref={viewportRef}
				className="h-[calc(100%-4rem)] overflow-auto relative font-sans"
				onScroll={handleScroll}
			>
				<div className="bg-background relative px-2 top-1">
					<div
						className="font-terminal text-sm text-muted-foreground pt-2 terminal-output"
						dangerouslySetInnerHTML={{
							__html: terminalTab === "fuel" ? output : realMarketOutput,
						}}
					/>
				</div>
			</div>
		</div>
	)
}
