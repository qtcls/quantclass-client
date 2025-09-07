/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import LoadingAnime from "@/renderer/components/LoadingAnime"
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
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/renderer/components/ui/hover-card"
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
import { useRealTradingRole } from "@/renderer/hooks/useRealTradingRole"
import { SettingsGearIcon } from "@/renderer/icons/SettingsGearIcon"

import { CoreVersionDes } from "@/renderer/page/home"
import { isShowMonitorPanelAtom } from "@/renderer/store"
import { libraryTypeAtom, versionListAtom } from "@/renderer/store/storage"
import { useLocalVersions, versionsAtom } from "@/renderer/store/versions"
import { userAtom } from "@/renderer/store/user"
import { formatBytes } from "@/renderer/utils/formatBytes"
import { useMutation } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"
import {
	Blocks,
	DatabaseZap,
	FolderClock,
	Monitor,
	RefreshCw,
	SquareFunction,
	SquareTerminal,
} from "lucide-react"
import { FC } from "react"
import Markdown from "react-markdown"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Img from "../../../build/icon.ico"
import { Badge } from "../components/ui/badge"

const { createTerminalWindow, openUserDirectory, rendererLog } =
	window.electronAPI

export const Footer: FC = () => {
	const setIsShowMonitorPanel = useSetAtom(isShowMonitorPanelAtom)
	const navigate = useNavigate()
	useHotkeys([
		["mod+`", async () => await createTerminalWindow()],
		["mod+,", () => navigate(SETTINGS_PAGE)],
	])

	return (
		<div className="flex h-10 items-center justify-between pl-4 text-foreground border-t">
			<CoreVersionDes
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
	const { isLoggedIn, user } = useAtomValue(userAtom)
	const { status, progress, updateInfo, confirmCallback } = useAppUpdate()
	const hasRealTradingAccess = useRealTradingRole()
	const {
		coreVersion,
		clientVersion,
		aquaVersion,
		zeusVersion,
		rocketVersion,
	} = useAtomValue(versionsAtom) ?? {}
	const libraryType = useAtomValue(libraryTypeAtom)
	const { refetchLocalVersions, isLoadingLocalVersions } = useLocalVersions()
	const { mutateAsync: fetchFuel, isPending } = useMutation({
		mutationKey: ["fetch-kernel-version"],
		mutationFn: async () => {
			rendererLog("info", "fetch latest kernel version")
			// return await getCoreAndClientVersion(user?.isMember ?? false)
		},
	})
	const setVersionList = useSetAtom(versionListAtom)

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
					<HoverCard>
						<HoverCardTrigger>
							<SidebarMenuButton size="lg" asChild>
								<div>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
										<Avatar className="size-8">
											<AvatarImage src={Img} alt="quantclass" />
											<AvatarFallback>Q</AvatarFallback>
										</Avatar>
									</div>
									<div className="flex flex-col gap-1 leading-none">
										<span className="font-semibold">量化小讲堂</span>
										<Badge>v{clientVersion}</Badge>
									</div>
								</div>
							</SidebarMenuButton>
						</HoverCardTrigger>

						<HoverCardContent className="cursor-text py-2">
							<div className="text-sm text-muted-foreground mb-2">
								内核版本
								<ButtonTooltip content="检查内核版本">
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 ml-2"
										onClick={async () => {
											if (!isLoggedIn) {
												toast.dismiss()
												toast.error("请先登录")
												return
											}
											await fetchFuel()
											await refetchLocalVersions()
										}}
									>
										<RefreshCw className="h-3 w-3" />
									</Button>
								</ButtonTooltip>
							</div>

							<div className="space-y-1.5">
								<div className="flex items-center gap-2">
									<DatabaseZap className="size-4" />
									<span className="text-sm">数据内核</span>
									<Badge
										className="ml-auto font-mono"
										variant={coreVersion ? "default" : "outline"}
									>
										v{coreVersion?.split("_")[2] ?? "暂无内核"}
									</Badge>
								</div>
								{hasRealTradingAccess && user?.isMember && (
									<>
										{libraryType === "select" ? (
											<div className="flex items-center gap-2">
												<SquareFunction className="size-4" />
												{/* <span className="size-1.5 rounded-full bg-primary/90" /> */}
												<span className="text-sm">选股内核</span>
												<Badge
													className="ml-auto font-mono"
													variant={aquaVersion ? "default" : "outline"}
												>
													v{aquaVersion?.split("_")[2] ?? "暂无内核"}
												</Badge>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<SquareFunction className="size-4" />
												<span className="text-sm">高级选股内核</span>
												<Badge
													className="ml-auto font-mono"
													variant={zeusVersion ? "default" : "outline"}
												>
													v{zeusVersion?.split("_")[2] ?? "暂无内核"}
												</Badge>
											</div>
										)}

										<div className="flex items-center gap-2">
											<Blocks className="size-4" />
											{/* <span className="size-1.5 rounded-full bg-primary/90" /> */}
											<span className="text-sm">下单内核</span>
											{/* <span className="text-sm text-muted-foreground ml-auto"> */}
											<Badge
												className="ml-auto font-mono"
												variant={rocketVersion ? "default" : "outline"}
											>
												v{rocketVersion?.split("_")[2] ?? "暂无内核"}
											</Badge>
										</div>
									</>
								)}
								<hr />
								<div
									className="flex items-center gap-2 cursor-pointer"
									onClick={() => {
										setVersionList([])
									}}
								>
									<span className="text-sm">客户端更新日志</span>
									<Badge className="ml-auto font-mono">v{clientVersion}</Badge>
								</div>
							</div>

							<LoadingAnime
								loading={isPending || isLoadingLocalVersions}
								type="coreUpdate"
							/>
						</HoverCardContent>
					</HoverCard>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	)
}
