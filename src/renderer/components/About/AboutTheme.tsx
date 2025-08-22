/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { CheckIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import * as React from "react"

import { useConfig } from "@/renderer/hooks/useConfig"
import { cn } from "@/renderer/lib/utils"
import "@renderer/mdx.css"

import { ThemeWrapper } from "@/renderer/components/theme-wrapper"
import { Button } from "@/renderer/components/ui/button"
import { Label } from "@/renderer/components/ui/label"
import { Separator } from "@/renderer/components/ui/separator"
import { Skeleton } from "@/renderer/components/ui/skeleton"
import { UndoIcon } from "@/renderer/icons/UndoIcon"
import { baseColors } from "@/renderer/registry/registry-base-color"

// -- 添加视图过渡动画样式
const viewTransitionStyle = `
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: scale 1s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
}

@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}`

// -- 注入动画样式
function injectViewTransitionStyle() {
	const style = document.createElement("style")
	style.textContent = viewTransitionStyle
	document.head.appendChild(style)
}

export function AboutTheme() {
	const [mounted, setMounted] = React.useState(false)
	const { setTheme: setMode, resolvedTheme: mode } = useTheme()
	const [config, setConfig] = useConfig()

	// -- 添加带动画的主题切换函数
	const handleThemeChange = (theme: string) => {
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				setMode(theme)
			})
		} else {
			setMode(theme)
		}
	}

	React.useEffect(() => {
		setMounted(true)
		injectViewTransitionStyle() // -- 初始化注入动画样式
	}, [])

	return (
		<ThemeWrapper className="flex flex-col space-y-4 md:space-y-6">
			<div className="space-y-2">
				<h4 className="text-base font-semibold">外观设置</h4>
				<p className="text-sm text-muted-foreground">定制您的客户端外观</p>
			</div>

			<Separator className="my-4" />

			<div className="flex items-start pt-4 md:pt-0">
				<div className="space-y-1 pr-2">
					<div className="font-semibold leading-none tracking-tight">
						自定义
					</div>
					<div className="text-xs text-muted-foreground">
						设置一个自己的风格和颜色
					</div>
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="ml-auto rounded-[0.5rem]"
					onClick={() => {
						setConfig({
							...config,
							theme: "zinc",
							radius: 0.5,
						})
					}}
				>
					<UndoIcon />
					<span className="sr-only">Reset</span>
				</Button>
			</div>
			<div className="flex flex-1 flex-col space-y-4 md:space-y-6">
				<div className="space-y-1.5">
					<Label className="text-xs">Color</Label>
					<div className="grid grid-cols-3 gap-2">
						{baseColors.map((theme) => {
							const isActive = config.theme === theme.name

							return mounted ? (
								<Button
									variant={"outline"}
									size="sm"
									key={theme.name}
									onClick={() => {
										setConfig({
											...config,
											theme: theme.name,
										})
									}}
									className={cn(
										"justify-start",
										isActive && "border-2 border-primary",
									)}
									style={
										{
											"--theme-primary": `hsl(${
												theme?.activeColor[mode === "dark" ? "dark" : "light"]
											})`,
										} as React.CSSProperties
									}
								>
									<span
										className={cn(
											"mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
										)}
									>
										{isActive && <CheckIcon className="h-4 w-4 text-white" />}
									</span>
									{theme.label}
								</Button>
							) : (
								<Skeleton className="h-8 w-full" key={theme.name} />
							)
						})}
					</div>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Radius</Label>
					<div className="grid grid-cols-5 gap-2">
						{["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
							return (
								<Button
									variant={"outline"}
									size="sm"
									key={value}
									onClick={() => {
										setConfig({
											...config,
											radius: parseFloat(value),
										})
									}}
									className={cn(
										config.radius === parseFloat(value) &&
											"border-2 border-primary",
									)}
								>
									{value}
								</Button>
							)
						})}
					</div>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Mode</Label>
					<div className="grid grid-cols-3 gap-2">
						{mounted ? (
							<>
								<Button
									variant={"outline"}
									size="sm"
									onClick={() => handleThemeChange("light")}
									className={cn(mode === "light" && "border-2 border-primary")}
								>
									<SunIcon className="mr-1 -translate-x-1" />
									Light
								</Button>
								<Button
									variant={"outline"}
									size="sm"
									onClick={() => handleThemeChange("dark")}
									className={cn(mode === "dark" && "border-2 border-primary")}
								>
									<MoonIcon className="mr-1 -translate-x-1" />
									Dark
								</Button>
							</>
						) : (
							<>
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</>
						)}
					</div>
				</div>
			</div>
		</ThemeWrapper>
	)
}
