/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/renderer/components/ui/popover"
import { cn } from "@/renderer/lib/utils"
import { forwardRef, useState } from "react"

interface GlowDotProps {
	className?: string
	size?: "sm" | "md" | "lg"
	color?: "blue" | "red" | "green" | "yellow"
	visible?: boolean
	message?: string
}

const GlowDot = forwardRef<HTMLDivElement, GlowDotProps>(
	(
		{ className, size = "sm", color = "blue", visible = true, message },
		ref,
	) => {
		const [isOpen, setIsOpen] = useState(false)

		if (!visible) return null

		const sizeClasses = {
			sm: "w-2 h-2",
			md: "w-3 h-3",
			lg: "w-4 h-4",
		}

		const colorClasses = {
			blue: "bg-blue-500",
			red: "bg-red-500",
			green: "bg-green-500",
			yellow: "bg-yellow-500",
		}

		const glowStyles = {
			blue: {
				boxShadow: "0 0 8px #3b82f6, 0 0 16px #3b82f650",
				animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			red: {
				boxShadow: "0 0 8px #ef4444, 0 0 16px #ef444450",
				animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			green: {
				boxShadow: "0 0 8px #10b981, 0 0 16px #10b98150",
				animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			yellow: {
				boxShadow: "0 0 8px #eab308, 0 0 16px #eab30850",
				animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
		}

		const dot = (
			<div
				ref={ref}
				className={cn(
					"rounded-full relative cursor-help",
					sizeClasses[size],
					colorClasses[color],
					className,
				)}
				style={glowStyles[color]}
			/>
		)

		if (message) {
			return (
				<div
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
				>
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger asChild>{dot}</PopoverTrigger>
						<PopoverContent className="w-80 p-3" sideOffset={0}>
							<div className="space-y-2">
								<h4 className="font-medium text-sm">版本更新提醒</h4>
								<div className="text-xs text-muted-foreground whitespace-pre-line">
									{message}
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			)
		}

		return (
			<div
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
			>
				{dot}
			</div>
		)
	},
)

GlowDot.displayName = "GlowDot"

export { GlowDot }
