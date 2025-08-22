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
import { useTheme } from "next-themes"
import * as React from "react"

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
	// -- 自定义不透明度
	darkOpacity?: string
	lightOpacity?: string
}

function useMouseOffset() {
	const [offset, setOffset] = React.useState<{ x: number; y: number }>()
	const [outside, setOutside] = React.useState(true)
	const ref = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		if (!ref.current?.parentElement) return

		const el = ref.current.parentElement
		const onMouseMove = (e: MouseEvent) => {
			const bound = el.getBoundingClientRect()
			setOffset({ x: e.clientX - bound.x, y: e.clientY - bound.y })
			setOutside(false)
		}

		const onMouseLeave = () => setOutside(true)

		el.addEventListener("mousemove", onMouseMove)
		el.addEventListener("mouseleave", onMouseLeave)
		return () => {
			el.removeEventListener("mousemove", onMouseMove)
			el.removeEventListener("mouseleave", onMouseLeave)
		}
	}, [])

	return [offset, outside, ref] as const
}

const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
	(
		{ className, darkOpacity = "0.1", lightOpacity = "0.07", ...props },
		forwardedRef,
	) => {
		const [offset, outside, ref] = useMouseOffset()
		const { theme } = useTheme()
		const isDark = theme === "dark"

		return (
			<div
				ref={(node) => {
					// -- 处理 forwardedRef
					if (typeof forwardedRef === "function") {
						forwardedRef(node)
					} else if (forwardedRef && "current" in forwardedRef) {
						;(
							forwardedRef as React.MutableRefObject<HTMLDivElement | null>
						).current = node
					}
					// -- 处理内部 ref
					// @ts-ignore
					if (ref) ref.current = node
				}}
				className={cn(
					"pointer-events-none absolute inset-0 z-10 transition-opacity duration-300",
					className,
				)}
				style={
					{
						background: `radial-gradient(600px circle at ${offset?.x ?? 0}px ${
							offset?.y ?? 0
						}px, var(--spotlight-color), transparent 40%)`,
						"--spotlight-color": isDark
							? `rgba(255, 255, 255, ${outside ? 0 : darkOpacity})`
							: `rgba(0, 0, 0, ${outside ? 0 : lightOpacity})`,
					} as React.CSSProperties
				}
				{...props}
			/>
		)
	},
)

Spotlight.displayName = "Spotlight"

export { Spotlight }
