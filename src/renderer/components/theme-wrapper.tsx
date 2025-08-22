/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useConfig } from "@/renderer/hooks/useConfig"
import { cn } from "@/renderer/lib/utils"
import * as React from "react"

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
	defaultTheme?: string
}

// 只包了body，如果对于弹窗，需要再包一下
export const ThemeWrapper = React.forwardRef<HTMLDivElement, ThemeWrapperProps>(
	({ defaultTheme, children, className, ...props }, ref) => {
		const [config] = useConfig()

		// 使用 useMemo 确保主题变化时重新计算
		const themeClassName = React.useMemo(() => {
			const theme = config.theme || defaultTheme || "zinc"
			return `theme-${theme}`
		}, [config.theme, defaultTheme])

		const themeStyle = React.useMemo(() => {
			return {
				"--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
			} as React.CSSProperties
		}, [defaultTheme, config.radius])

		return (
			<div
				ref={ref}
				key={`theme-${themeClassName}-${config.radius}`}
				className={cn(themeClassName, "w-full", className)}
				style={themeStyle}
				{...props}
			>
				{children}
			</div>
		)
	},
)

ThemeWrapper.displayName = "ThemeWrapper"
