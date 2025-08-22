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

const penVariants: Variants = {
	normal: {
		rotate: 0,
		x: 0,
		y: 0,
	},
	animate: {
		rotate: [-0.5, 0.5, -0.5],
		x: [0, -1, 1.5, 0],
		y: [0, 1.5, -1, 0],
	},
}

const EditIcon = ({
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
				"cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center",
				className,
			)}
			onMouseEnter={() => controls.start("animate")}
			onMouseLeave={() => controls.start("normal")}
		>
			<svg
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
				<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
				<motion.path
					d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
					variants={penVariants}
					animate={controls}
					transition={{
						duration: 0.5,
						repeat: 1,
						ease: "easeInOut",
					}}
				/>
			</svg>
		</div>
	)
}

export { EditIcon }
