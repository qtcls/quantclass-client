/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

import { cn } from "@renderer/lib/utils"

export function NumberTicker({
	value,
	direction = "up",
	delay = 0,
	className,
	decimalPlaces = 0,
}: {
	value: number
	direction?: "up" | "down"
	className?: string
	delay?: number // delay in s
	decimalPlaces?: number
}) {
	const ref = useRef<HTMLSpanElement>(null)
	const motionValue = useMotionValue(direction === "down" ? value : 0)
	const springValue = useSpring(motionValue, {
		damping: 120,
		stiffness: 1500,
	})
	const isInView = useInView(ref, { once: true, margin: "0px" })

	useEffect(() => {
		isInView &&
			setTimeout(() => {
				motionValue.set(direction === "down" ? 0 : value)
			}, delay * 1000)
	}, [motionValue, isInView, delay, value, direction])

	useEffect(
		() =>
			springValue.on("change", (latest) => {
				if (ref.current) {
					ref.current.textContent = Intl.NumberFormat("en-US", {
						minimumFractionDigits: decimalPlaces,
						maximumFractionDigits: decimalPlaces,
					}).format(Number(latest.toFixed(decimalPlaces)))
				}
			}),
		[springValue, decimalPlaces],
	)

	return (
		<span
			className={cn(
				"inline-block tabular-nums text-primary tracking-wider",
				className,
			)}
			ref={ref}
		/>
	)
}
