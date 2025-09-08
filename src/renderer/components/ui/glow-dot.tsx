/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { cn } from "@/renderer/lib/utils"
import { forwardRef } from "react"

interface GlowDotProps {
	className?: string
	size?: "sm" | "md" | "lg"
	color?: "blue" | "red" | "green" | "yellow"
	visible?: boolean
}

const GlowDot = forwardRef<HTMLDivElement, GlowDotProps>(
	({ className, size = "sm", color = "blue", visible = true }, ref) => {
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

		return dot
	},
)

GlowDot.displayName = "GlowDot"

export { GlowDot }
