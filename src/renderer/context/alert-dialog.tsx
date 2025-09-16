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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/renderer/components/ui/dialog"
import { Loader2 } from "lucide-react"
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { cn } from "../lib/utils"

interface AlertDialogState {
	isOpen: boolean
	title: string
	description?: string
	content: ReactNode
	okText?: string
	cancelText?: string
	okDelay?: number // 延迟时间，单位为秒
	onOk?: () => void | Promise<void>
	onCancel?: () => void | Promise<void>
	isContentLong?: boolean
	disableClose?: boolean
	size?: "md" | "lg" | "xl" | "2xl"
}

interface AlertDialogContextType {
	open: (options: Omit<AlertDialogState, "isOpen">) => void
	close: () => void
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
	undefined,
)

export function AlertDialogProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AlertDialogState>({
		isOpen: false,
		title: "",
		content: null,
		okText: "确定",
		cancelText: "取消",
		description: "",
		okDelay: 0,
		disableClose: false,
	})

	const [loading, setLoading] = useState(false)
	const [seconds, setSeconds] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const open = useCallback((options: Omit<AlertDialogState, "isOpen">) => {
		setState({ ...options, isOpen: true })
	}, [])

	const close = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }))
	}, [])

	useEffect(() => {
		if (state.isOpen && state.okDelay && state.okDelay > 0) {
			setSeconds(state.okDelay)

			// 清除之前的定时器
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}

			// 设置新的倒计时定时器
			intervalRef.current = setInterval(() => {
				setSeconds((prev) => {
					if (prev <= 1) {
						// 倒计时结束，清除定时器
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							intervalRef.current = null
						}
						return 0
					}
					return prev - 1
				})
			}, 1000)
		} else {
			// 如果对话框关闭或没有延迟，重置倒计时
			setSeconds(0)
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}

		// 清理函数：组件卸载时清除定时器
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [state.isOpen, state.okDelay])

	return (
		<AlertDialogContext.Provider value={{ open, close }}>
			{children}
			<Dialog open={state.isOpen} onOpenChange={close}>
				<DialogContent
					className={cn(
						"p-0 space-y-0 gap-0",
						state.size && `max-w-${state.size}`,
					)}
					disableClose={loading || state.disableClose}
				>
					<DialogHeader className="p-4">
						<DialogTitle>{state.title}</DialogTitle>
						<DialogDescription className={state.description ? "" : "hidden"}>
							{state.description}
						</DialogDescription>
					</DialogHeader>
					<div
						className={cn(
							"max-h-[75vh] overflow-y-auto py-3 px-4",
							state.isContentLong && "border-y",
						)}
					>
						{state.content}
					</div>
					<DialogFooter className="p-4">
						<Button
							variant="outline"
							disabled={loading}
							size="sm"
							onClick={() => {
								state.onCancel ? state.onCancel() : close()
							}}
						>
							{state.cancelText || "取消"}
						</Button>
						<Button
							disabled={loading || seconds > 0}
							size="sm"
							onClick={async () => {
								setLoading(true)
								if (state.onOk) {
									// 无论 onOk 是否为 async 函数，await 都可以安全使用
									await state.onOk()
								}
								setLoading(false)
								close()
							}}
						>
							{loading ? (
								<Loader2 className="animate-spin" />
							) : (
								<span className="flex items-center gap-2">
									{state.okText || "确定"}
									{seconds > 0 && <span>({seconds}s)</span>}
								</span>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AlertDialogContext.Provider>
	)
}

export function useAlertDialog() {
	const context = useContext(AlertDialogContext)
	if (!context) {
		throw new Error("useAlertDialog must be used within AlertDialogProvider")
	}
	return context
}
