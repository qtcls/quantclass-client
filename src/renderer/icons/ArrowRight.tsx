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

const pathVariants: Variants = {
	normal: { d: "M5 12h14" },
	animate: {
		d: ["M5 12h14", "M5 12h9", "M5 12h14"],
		transition: {
			duration: 0.4,
		},
	},
}

const secondaryPathVariants: Variants = {
	normal: { d: "m12 5 7 7-7 7", translateX: 0 },
	animate: {
		d: "m12 5 7 7-7 7",
		translateX: [0, -3, 0],
		transition: {
			duration: 0.4,
		},
	},
}

const ArrowRight = ({
	className,
	forceAnimate = false,
}: {
	className?: string
	forceAnimate?: boolean
}) => {
	const controls = useAnimation()

	useEffect(() => {
		if (forceAnimate) {
			controls.start("animate")
		} else {
			controls.start("normal")
		}
	}, [forceAnimate, controls])

	return (
		<div
			className={cn(
				"cursor-pointer select-none flex items-center justify-center",
				className,
			)}
			onMouseEnter={() => controls.start("animate")}
			onMouseLeave={() => controls.start("normal")}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<motion.path d="M5 12h14" variants={pathVariants} animate={controls} />
				<motion.path
					d="m12 5 7 7-7 7"
					variants={secondaryPathVariants}
					animate={controls}
				/>
			</svg>
		</div>
	)
}

export { ArrowRight }
