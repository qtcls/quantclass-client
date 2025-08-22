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
import { Variants, motion, useAnimation } from "framer-motion"
import { useEffect } from "react"

const circleVariants: Variants = {
	normal: {
		translateY: 0,
		opacity: 1,
		transition: {
			opacity: { duration: 0.2 },
			type: "spring",
			stiffness: 150,
			damping: 15,
			bounce: 0.8,
		},
	},
	animate: {
		opacity: [0, 1],
		translateY: [-20, 0],
		transition: {
			opacity: { duration: 0.2 },
			type: "spring",
			stiffness: 150,
			damping: 15,
			bounce: 0.8,
		},
	},
}

const secondCircleVariants: Variants = {
	normal: {
		translateY: 0,
		opacity: 1,
		transition: {
			opacity: { duration: 0.2 },
			delay: 0.15,
			type: "spring",
			stiffness: 150,
			damping: 15,
			bounce: 0.8,
		},
	},
	animate: {
		opacity: [0, 1],
		translateY: [-20, 0],
		transition: {
			opacity: { duration: 0.2 },
			delay: 0.15,
			type: "spring",
			stiffness: 150,
			damping: 15,
			bounce: 0.8,
		},
	},
}

export interface HandCoinsIconProps {
	className?: string
	forceAnimate?: boolean
	isHovered?: boolean
	disableWrapper?: boolean
}

const HandCoinsIcon = ({
	className,
	isHovered = false,
	disableWrapper = false,
}: HandCoinsIconProps) => {
	const controls = useAnimation()

	useEffect(() => {
		if (isHovered) {
			controls.start("animate")
		} else {
			controls.start("normal")
		}
	}, [isHovered, controls])

	const svgContent = (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
			<path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
			<path d="m2 16 6 6" />
			<motion.circle
				cx="16"
				cy="9"
				r="2.9"
				animate={controls}
				variants={circleVariants}
			/>
			<motion.circle
				cx="6"
				cy="5"
				r="3"
				animate={controls}
				variants={secondCircleVariants}
			/>
		</svg>
	)

	if (disableWrapper) {
		return svgContent
	}

	return (
		<div
			className={cn(
				"cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center",
				className,
			)}
			onMouseEnter={() => controls.start("animate")}
			onMouseLeave={() => controls.start("normal")}
		>
			{svgContent}
		</div>
	)
}

export { HandCoinsIcon }
