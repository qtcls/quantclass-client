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
import { ShieldBan, Trash } from "lucide-react"
import { useState } from "react"

import { toast } from "sonner"
import { validateStockCode } from "@/renderer/utils"
import { useBuyBlacklist } from "@/renderer/hooks/useBuyBlacklist"
import BuyBlacklistAddConfirm from "./confirm-add-dialog"
import { useAlertDialog } from "@/renderer/context/alert-dialog"

export default function BuyBlacklistAddInput() {
	const { addBlacklistItem, setBuyBlacklist, isBlacklisted, buyBlacklist } =
		useBuyBlacklist()
	const [input, setInput] = useState("")

	const { open: openAlert } = useAlertDialog()

	const [reasonDialog, setReasonDialog] = useState(false)
	const [pendingStockCode, setPendingStockCode] = useState("")

	// 验证股票代码并处理拉黑逻辑
	const handleBlacklistStock = (stockCode: string) => {
		// 检查是否已拉黑
		if (isBlacklisted(stockCode)) {
			toast.warning("该股票已拉黑")
			return
		}

		// 验证股票代码格式
		if (!validateStockCode(stockCode)) {
			toast.error(
				"请输入正确的股票代码格式（如：sz000001、sh600000、bj430047）",
			)
			return
		}

		// 打开原因输入对话框
		setPendingStockCode(stockCode)
		setReasonDialog(true)
	}

	// 处理输入框回车键
	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && input.trim()) {
			handleBlacklistStock(input.trim())
		}
	}

	const handleClearBlacklist = () => {
		openAlert({
			title: "确认清空黑名单吗？",
			content: (
				<div className="leading-relaxed">
					<span>该操作会移除所有已拉黑的股票。</span>
					<br />
					<span className="text-destructive font-semibold">
						此操作不可撤销。
					</span>
				</div>
			),
			okText: "清空",
			cancelText: "取消",
			onOk: () => {
				setBuyBlacklist([])
				toast.success("已清空黑名单")
			},
		})
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<Input
					placeholder="请输入股票代码（如：sz000001、sh600000、bj430047）"
					value={input}
					onChange={(e) => {
						const value = e.target.value.toLowerCase()
						setInput(value)
					}}
					className="max-w-96 h-8"
					onKeyDown={handleInputKeyDown}
				/>
				<Button
					disabled={!input.trim()}
					onClick={() => handleBlacklistStock(input.trim())}
					className="gap-1 h-8"
					size="sm"
				>
					<ShieldBan className="size-4" />
					<span>拉黑</span>
				</Button>
				<Button
					disabled={buyBlacklist.length === 0}
					size="sm"
					variant="outline"
					className="gap-1 h-8"
					onClick={handleClearBlacklist}
				>
					<Trash className="size-4" />
					<span>清空黑名单</span>
				</Button>
			</div>
			<BuyBlacklistAddConfirm
				show={reasonDialog}
				setShow={setReasonDialog}
				stockCode={pendingStockCode}
				onConfirm={(buyBlacklistItem) => {
					addBlacklistItem(buyBlacklistItem)
					setReasonDialog(false)
					setInput("")
					toast.success(`拉黑${buyBlacklistItem.code}成功`)
				}}
			/>
		</>
	)
}
