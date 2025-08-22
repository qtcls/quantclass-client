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
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/renderer/components/ui/command"
import { ROUTES } from "@/renderer/constant/route"
import { ArrowRight } from "@/renderer/icons/ArrowRight"
import { SettingsGearIcon } from "@/renderer/icons/SettingsGearIcon"
import { isShowSpotlightAtom } from "@/renderer/store"
import { useAtom } from "jotai"
import { FolderClock } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export const QuickCommand = () => {
	const navigate = useNavigate()
	const { setTheme: setMode } = useTheme()
	const [isShowSpotlight, setIsShowSpotlight] = useAtom(isShowSpotlightAtom)
	const { openUserDirectory } = window.electronAPI
	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setIsShowSpotlight((open) => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	const CommandItemWithIcon = ({ children, onSelect, icon: Icon }) => {
		const [isHovered, setIsHovered] = useState(false)

		return (
			<CommandItem
				onSelect={onSelect}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Icon className="text-muted-foreground" forceAnimate={isHovered} />
				{children}
			</CommandItem>
		)
	}

	return (
		<CommandDialog open={isShowSpotlight} onOpenChange={setIsShowSpotlight}>
			<CommandInput placeholder="输入指令或搜索..." />
			<CommandList>
				<CommandEmpty>没有找到结果...</CommandEmpty>

				<CommandGroup heading="工具">
					<CommandItem
						onSelect={() => {
							openUserDirectory("logs")
							setIsShowSpotlight(false)
						}}
					>
						<FolderClock className="text-muted-foreground" />
						<span>打开日志文件夹</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="导航">
					{ROUTES.map((route) => (
						<CommandItemWithIcon
							key={route.key}
							onSelect={() => {
								navigate(route.key)
								setIsShowSpotlight(false)
							}}
							icon={ArrowRight}
						>
							<span>{route.label}</span>
						</CommandItemWithIcon>
					))}
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="设置">
					<CommandItemWithIcon
						onSelect={() => {
							setMode("dark")
							setIsShowSpotlight(false)
						}}
						icon={SettingsGearIcon}
					>
						<span>更改主题为 深色</span>
					</CommandItemWithIcon>
					<CommandItemWithIcon
						onSelect={() => {
							setMode("light")
							setIsShowSpotlight(false)
						}}
						icon={SettingsGearIcon}
					>
						<span>更改主题为 浅色</span>
					</CommandItemWithIcon>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
