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
import { useToggleAutoRealTrading } from "@/renderer/hooks/useToggleAutoRealTrading"
import { Play, RefreshCw } from "lucide-react"
import { useScheduleTimes } from "@/renderer/hooks"

export default function TradeCtrlBtn({
	onClick,
	size = "default",
	className,
}: {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
	size?: "sm" | "default" | "lg" | "icon"
	className?: string
}) {
	const { selectScheduleTimes } = useScheduleTimes()
	const { isAutoRocket, handleToggleAutoRocket } = useToggleAutoRealTrading()

	return isAutoRocket ? (
		<ButtonTooltip
			content={
				selectScheduleTimes.length > 0
					? "点击暂停定时实盘（只在指定时间运行）"
					: "点击暂停自动实盘"
			}
		>
			<Button
				onClick={() => handleToggleAutoRocket(false)}
				variant={selectScheduleTimes.length > 0 ? "successOutline" : "success"}
				size={size as "sm" | "default" | "lg" | "icon"}
				className={className}
			>
				<RefreshCw className="size-5 animate-spin mr-0.5" />
				暂停实盘
			</Button>
		</ButtonTooltip>
	) : (
		<ButtonTooltip
			content={
				selectScheduleTimes.length > 0
					? "启动定时实盘（只在指定时间运行）"
					: "启动自动实盘"
			}
		>
			<Button
				onClick={(e) => {
					e.stopPropagation()
					if (onClick) {
						onClick(e)
					} else {
						handleToggleAutoRocket(false, true)
					}
				}}
				size={size as "sm" | "default" | "lg" | "icon"}
				className={className}
			>
				<Play className="mr-2 size-4" /> 启动实盘
			</Button>
		</ButtonTooltip>
	)
}
