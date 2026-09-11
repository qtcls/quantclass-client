import {
	memberPromoBorderClassName,
	memberPromoGradientClassName,
	memberPromoShimmerOverlayClassName,
	memberPromoTextClassName,
} from "@/renderer/components/member-promo/theme"
import { cn } from "@/renderer/lib/utils"
import React from "react"

interface AnimatedRainbowCardProps {
	children?: React.ReactNode
	className?: string
	icon?: React.ReactNode
	title?: string
	description?: string
}

export function AnimatedRainbowCard({
	children,
	className,
	icon,
	title,
	description,
}: AnimatedRainbowCardProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg border px-4 py-3",
				memberPromoGradientClassName,
				memberPromoBorderClassName,
				className,
			)}
		>
			<div aria-hidden className={memberPromoShimmerOverlayClassName} />

			<div className="relative z-10">
				{(icon || title) && (
					<div
						className={cn("flex items-center gap-2", memberPromoTextClassName)}
					>
						{icon && <span className="text-2xl">{icon}</span>}
						{title && <span className="font-medium">{title}</span>}
					</div>
				)}

				{description && (
					<p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
						{description?.split("\n").map((line, index) => (
							<React.Fragment key={index}>
								{line}
								{index < description.split("\n").length - 1 && <br />}
							</React.Fragment>
						))}
					</p>
				)}

				{children}
			</div>
		</div>
	)
}
