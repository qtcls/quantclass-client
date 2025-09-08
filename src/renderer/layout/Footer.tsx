/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { ThemeCustomizer } from "@/renderer/components/theme-customizer"
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/renderer/components/ui/avatar"
import { Button } from "@/renderer/components/ui/button"
import ButtonTooltip from "@/renderer/components/ui/button-tooltip"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/renderer/components/ui/dialog"
import { Progress } from "@/renderer/components/ui/progress"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/renderer/components/ui/sidebar"
import { InlineCode } from "@/renderer/components/ui/typography"
import { SETTINGS_PAGE, isWindows } from "@/renderer/constant"
import { UpdateStatus } from "@/renderer/context/update-context"
import { useAppUpdate } from "@/renderer/hooks/useAppUpdate"
import { useHotkeys } from "@/renderer/hooks/useHotkeys"
import { SettingsGearIcon } from "@/renderer/icons/SettingsGearIcon"

import { KernalVersionDes } from "@/renderer/page/home"
import { isShowMonitorPanelAtom } from "@/renderer/store"
import { versionsAtom } from "@/renderer/store/versions"
import { formatBytes } from "@/renderer/utils/formatBytes"
import { useAtomValue, useSetAtom } from "jotai"
import { FolderClock, Monitor, SquareTerminal } from "lucide-react"
import { FC } from "react"
import Markdown from "react-markdown"
import { useLocation, useNavigate } from "react-router"
import Img from "../../../build/icon.ico"
import { Badge } from "../components/ui/badge"
import { GlowDot } from "@/renderer/components/ui/glow-dot"
import { useVersionCheck } from "@/renderer/hooks/useVersionCheck"

const { createTerminalWindow, openUserDirectory } = window.electronAPI

export const Footer: FC = () => {
	const setIsShowMonitorPanel = useSetAtom(isShowMonitorPanelAtom)
	const navigate = useNavigate()
	useHotkeys([
		["mod+`", async () => await createTerminalWindow()],
		["mod+,", () => navigate(SETTINGS_PAGE)],
	])

	return (
		<div className="flex h-10 items-center justify-between pl-4 text-foreground border-t">
			<KernalVersionDes
				textSize="base"
				layout="horizontal"
				className="gap-4 text-xs text-muted-foreground h-full items-center"
			/>
			<div className="flex items-center mr-2">
				<ThemeCustomizer />

				<ButtonTooltip content="打开日志文件夹">
					<Button
						variant="ghost"
						size="icon"
						className="focus-visible:outline-none focus-visible:ring-transparent"
						onClick={() => openUserDirectory("logs")}
					>
						<FolderClock className="h-4 w-4 text-foreground hover:cursor-pointer" />
					</Button>
				</ButtonTooltip>

				<ButtonTooltip content="点击打开进程监控面板">
					<Button
						variant="ghost"
						size="icon"
						className="focus-visible:outline-none focus-visible:ring-transparent"
						onClick={() => setIsShowMonitorPanel((prev) => !prev)}
					>
						<Monitor className="h-4 w-4 text-foreground hover:cursor-pointer" />
					</Button>
				</ButtonTooltip>

				<ButtonTooltip
					content={
						<div>
							动态日志面板{" "}
							{isWindows ? (
								<>
									<InlineCode>Ctrl</InlineCode> <InlineCode>`</InlineCode>
								</>
							) : (
								<>
									<InlineCode>⌘</InlineCode> <InlineCode>`</InlineCode>
								</>
							)}
						</div>
					}
				>
					<Button
						variant="ghost"
						size="icon"
						className="focus-visible:outline-none focus-visible:ring-transparent"
						// onClick={() => setIsShowTerminalPanel((prev) => !prev)}
						onClick={async () => await createTerminalWindow()}
					>
						<SquareTerminal className="h-4 w-4 text-foreground hover:cursor-pointer" />
					</Button>
				</ButtonTooltip>

				<ButtonTooltip content="设置">
					<Button
						variant="ghost"
						size="icon"
						className="focus-visible:outline-none focus-visible:ring-transparent"
						onClick={() => navigate(SETTINGS_PAGE)}
					>
						<SettingsGearIcon className="h-4 w-4 text-foreground hover:cursor-pointer" />
					</Button>
				</ButtonTooltip>
			</div>
		</div>
	)
}

export const _SiderFooter = () => {
	const { status, progress, updateInfo, confirmCallback } = useAppUpdate()
	const { clientVersion } = useAtomValue(versionsAtom) ?? {}
	const { hasAnyUpdate, getUpdateMessage } = useVersionCheck()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	return (
		<SidebarFooter>
			<SidebarMenu>
				{isWindows && status === UpdateStatus.Downloading && (
					<SidebarMenuItem>
						<SidebarMenuButton className="flex flex-col h-14">
							<p className="min-w-32">
								下载更新中：{formatBytes(progress?.bytesPerSecond!)} /s
							</p>
							<Progress value={progress?.percent ?? 0} />
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
				{isWindows && status === UpdateStatus.Confirm && (
					<SidebarMenuItem>
						<div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
							<div className="flex gap-3">
								<div className="flex grow flex-col gap-3">
									<div className="space-y-1">
										<p className="text-sm font-medium">
											{updateInfo?.version} 已下载
										</p>
									</div>
									<div className="flex gap-2">
										<Dialog>
											<DialogTrigger asChild>
												<Button size="sm">下载完成，查看更新内容</Button>
											</DialogTrigger>
											<DialogContent className="w-[485px]">
												<DialogHeader>
													<DialogTitle>
														{updateInfo?.version}-更新日志
													</DialogTitle>
												</DialogHeader>
												<ScrollArea className="h-[250px] border border-muted-foreground rounded-lg p-2.5">
													<Markdown>
														{updateInfo?.releaseNotes as string}
													</Markdown>
												</ScrollArea>
												<DialogFooter>
													<Button onClick={() => confirmCallback(true)}>
														立即应用新版本
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</div>
							</div>
						</div>
					</SidebarMenuItem>
				)}

				<SidebarMenuItem>
					{!pathname.includes(SETTINGS_PAGE) && (
						<SidebarMenuButton
							size="lg"
							onClick={() => navigate(SETTINGS_PAGE)}
							className="overflow-visible"
						>
							<div className="flex items-center gap-2.5">
								<Avatar className="size-10 border bg-white dark:border-white ">
									<AvatarImage src={Img} alt="quantclass" />
									<AvatarFallback>Q</AvatarFallback>
								</Avatar>
								<div className="flex flex-col gap-1 leading-none">
									<div className="relative">
										<span className="font-semibold">量化小讲堂</span>
										<GlowDot
											visible={hasAnyUpdate}
											size="sm"
											color="blue"
											message={getUpdateMessage}
											className="absolute -top-0.5 -right-3"
										/>
									</div>
									<Badge>v{clientVersion}</Badge>
								</div>
							</div>
						</SidebarMenuButton>
					)}
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	)
}
