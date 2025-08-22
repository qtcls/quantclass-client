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
import { useMemo, useState } from "react"

import { toast } from "sonner"
import { validateStockCode } from "@/renderer/utils"
import { useBuyBlacklist } from "@/renderer/hooks/useBuyBlacklist"
import BuyBlacklistAddConfirm from "./confirm-add-dialog"
import { ShieldBan, Trash2 } from "lucide-react"
import ButtonTooltip from "@/renderer/components/ui/button-tooltip"

export default function BuyBlacklistAddBtn({
	stockCode,
}: {
	stockCode: string
}) {
	const {
		addBlacklistItem,
		removeBlacklistItem,
		isBlacklisted: isBlacklistedFn,
	} = useBuyBlacklist()

	const [reasonDialog, setReasonDialog] = useState(false)

	const isBlacklisted = useMemo(() => {
		return isBlacklistedFn(stockCode)
	}, [isBlacklistedFn, stockCode])

	// 验证股票代码并处理拉黑逻辑
	const handleBlacklistStock = (stockCode: string) => {
		// 检查是否已拉黑
		if (isBlacklisted) {
			removeBlacklistItem(stockCode)
			toast.success(`已从黑名单中移除${stockCode}`)
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
		setReasonDialog(true)
	}

	return (
		<>
			<div className="flex items-center gap-2 max-w-[70px]">
				<ButtonTooltip
					content={
						isBlacklisted
							? `取消拉黑${stockCode}，允许买入`
							: `拉黑${stockCode}，禁止买入`
					}
				>
					<Button
						onClick={() => handleBlacklistStock(stockCode)}
						size="sm"
						variant={isBlacklisted ? "outline" : "default"}
						className="gap-1 h-7"
					>
						{isBlacklisted ? (
							<>
								<Trash2 className="h-4 w-4 text-destructive" />
								<span>取消</span>
							</>
						) : (
							<>
								<ShieldBan className="h-4 w-4" />
								<span>拉黑</span>
							</>
						)}
					</Button>
				</ButtonTooltip>
			</div>
			<BuyBlacklistAddConfirm
				show={reasonDialog}
				setShow={setReasonDialog}
				stockCode={stockCode}
				onConfirm={(buyBlacklistItem) => {
					addBlacklistItem(buyBlacklistItem)
					setReasonDialog(false)
					toast.success(`拉黑${buyBlacklistItem.code}成功`)
				}}
			/>
		</>
	)
}
