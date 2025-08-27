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
	useState,
} from "react"

interface AlertDialogState {
	isOpen: boolean
	title: string
	description?: string
	content: ReactNode
	okText?: string
	cancelText?: string
	onOk?: () => void | Promise<void>
	onCancel?: () => void | Promise<void>
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
	})

	const [loading, setLoading] = useState(false)

	const open = useCallback((options: Omit<AlertDialogState, "isOpen">) => {
		setState({ ...options, isOpen: true })
	}, [])

	const close = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }))
	}, [])

	return (
		<AlertDialogContext.Provider value={{ open, close }}>
			{children}
			<Dialog open={state.isOpen} onOpenChange={close}>
				<DialogContent className="p-4" disableClose={loading}>
					<DialogHeader>
						<DialogTitle>{state.title}</DialogTitle>
						<DialogDescription className={state.description ? "" : "hidden"}>
							{state.description}
						</DialogDescription>
					</DialogHeader>
					{typeof state.content === "string" ? null : state.content}
					<DialogFooter>
						{state.cancelText ? (
							<Button
								variant="outline"
								disabled={loading}
								onClick={() => {
									state.onCancel ? state.onCancel() : close()
								}}
							>
								{state.cancelText}
							</Button>
						) : (
							<Button variant="outline" disabled={loading} onClick={close}>
								取消
							</Button>
						)}
						<Button
							disabled={loading}
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
								<span className="flex items-center gap-2">{state.okText}</span>
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
