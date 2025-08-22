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
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/renderer/components/ui/avatar"
import { Label } from "@/renderer/components/ui/label"
import { Separator } from "@/renderer/components/ui/separator"
import { Switch } from "@/renderer/components/ui/switch"
import { contributorsList } from "@/renderer/constant"
import { usePermissionCheck } from "@/renderer/hooks"
import { useRealTradingRole } from "@/renderer/hooks/useRealTradingRole"
import { cn } from "@/renderer/lib/utils"
import {
	isAutoLaunchRealTradingAtom,
	isAutoLaunchUpdateAtom,
	isAutoLoginAtom,
	userChoiceAtom,
	versionAtom,
} from "@/renderer/store/storage"
import { userAtom } from "@/renderer/store/user"
import { useAtom, useAtomValue } from "jotai"
import { Blocks, DatabaseZap, SquareFunction } from "lucide-react"
import { toast } from "sonner"
import Img from "../../../../build/icon.ico"
import { Badge } from "../ui/badge"

const { setStoreValue, setAutoLaunch, openUrl } = window.electronAPI

export default function AboutInfo() {
	const { user } = useAtomValue(userAtom)
	const { check } = usePermissionCheck()
	const hasRealTradingAccess = useRealTradingRole()
	// const setIsShowAbout = useSetAtom(isShowAboutAtom)
	const version = useAtomValue(versionAtom)
	const [isAutoLogin, setIsAutoLogin] = useAtom(isAutoLoginAtom)
	const [isAutoLaunchUpdate, setIsAutoLaunchUpdate] = useAtom(
		isAutoLaunchUpdateAtom,
	)
	const [isAutoLaunchRealTrading, setIsAutoLaunchRealTrading] = useAtom(
		isAutoLaunchRealTradingAtom,
	)
	const [userChoice, setUserChoice] = useAtom(userChoiceAtom)

	const handleSetIsAutoLaunchUpdate = async (value: boolean) => {
		setIsAutoLaunchUpdate(value)
		await setStoreValue("settings.is_auto_launch_update", value)
		if (!value) {
			setIsAutoLaunchRealTrading(false)
			await setStoreValue("settings.is_auto_launch_real_trading", false)
		}
		toast.dismiss()
		toast.success(value ? "自动更新已开启" : "自动更新已关闭")
	}

	const handleSetIsAutoLaunchRealTrading = async (value: boolean) => {
		if (!check({ requireMember: true, onlyIn2025: true }).isValid) return

		setIsAutoLaunchRealTrading(value)
		setStoreValue("settings.is_auto_launch_real_trading", value)
		if (value) {
			setIsAutoLaunchUpdate(true)
			setStoreValue("settings.is_auto_launch_update", true)
		}
		toast.dismiss()
		toast.success(value ? "实盘自动启动已开启" : "实盘自动启动已关闭")
	}

	const handleSetUserChoice = async (value: boolean) => {
		setUserChoice(value)
		setStoreValue("settings.user_choice", value)
		toast.dismiss()
		toast.success(
			value ? "退出时最小化到系统托盘已开启" : "退出时最小化到系统托盘已关闭",
		)
	}

	const handleSetIsAutoLogin = async (value: boolean) => {
		await setAutoLaunch(value)
		setIsAutoLogin(value)
		toast.dismiss()
		toast.success(value ? "开机自启动已开启" : "开机自启动已关闭")
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h4 className="text-xl font-semibold">关于量化小讲堂客户端</h4>
				<p className="text-sm text-muted-foreground">
					提供量化交易策略的开发、回测、模拟交易、实盘交易等功能。
				</p>
			</div>

			<Separator />

			<div className="space-y-4">
				{/* <div className="text-sm text-muted-foreground">版本</div> */}

				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={Img} alt="@shadcn" />
						<AvatarFallback>Q</AvatarFallback>
					</Avatar>

					<div className="text-sm space-y-1">
						<div className="font-semibold text-sm">量化小讲堂</div>
						<div className="text-xs text-muted-foreground">
							2025版 (v{version.clientVersion})
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3">
					<div className="space-y-1">
						<h3 className="font-medium text-sm flex items-center gap-1">
							<DatabaseZap className="size-4" />
							数据内核版本
						</h3>
						<Badge className="font-mono">{version.coreVersion}</Badge>
					</div>

					{hasRealTradingAccess && user?.isMember && (
						<>
							<div className="space-y-1">
								<h3 className="font-medium text-sm flex items-center gap-1">
									<SquareFunction className="size-4" />
									选股内核版本
								</h3>
								<Badge className="font-mono">{version.aquaVersion}</Badge>
							</div>

							<div className="space-y-1">
								<h3 className="font-medium text-sm flex items-center gap-1">
									<Blocks className="size-4" />
									实盘内核版本
								</h3>
								<Badge className="font-mono">{version.rocketVersion}</Badge>
							</div>
						</>
					)}
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				{/*{(VITE_XBX_ENV === "development" || (isWindows && user?.isMember)) && (*/}
				{/*	<div className="flex items-center justify-between">*/}
				{/*		<div className="space-y-1">*/}
				{/*			<h3 className="font-medium text-sm">检查更新</h3>*/}
				{/*			<p className="text-xs text-muted-foreground">*/}
				{/*				手动检查客户端版本更新*/}
				{/*			</p>*/}
				{/*		</div>*/}
				{/*		<Button*/}
				{/*			onClick={async () => {*/}
				{/*				const data = await checkForUpdate()*/}
				{/*				if (data.updateInfo.version === version.clientVersion) {*/}
				{/*					toast.dismiss()*/}
				{/*					toast.info("当前已是最新版本")*/}
				{/*				}*/}
				{/*				if (data.updateInfo.version !== version.clientVersion) {*/}
				{/*					toast.dismiss()*/}
				{/*					toast.info("发现新版本，开始下载")*/}
				{/*					setIsShowAbout(false)*/}
				{/*				}*/}
				{/*				if (error) {*/}
				{/*					toast.error("检查更新失败")*/}
				{/*				}*/}
				{/*			}}*/}
				{/*			disabled={isPending}*/}
				{/*		>*/}
				{/*			{isPending ? "检查中..." : "检查更新"}*/}
				{/*		</Button>*/}
				{/*	</div>*/}
				{/*)}*/}

				{/* <div className="flex items-center justify-between">
					<div className="space-y-1">
						<h3 className="font-medium text-sm">清理数据订阅</h3>
						<p className="text-xs text-muted-foreground">
							清理客户端中所有数据订阅相关的缓存
						</p>
					</div>
					<Button onClick={clearDataSubscriptions}>一键清理</Button>
				</div>

				{(VITE_XBX_ENV === "development" || (user?.isMember && isWindows)) && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="font-medium text-sm">清空已导入策略</h3>
								<p className="text-xs text-muted-foreground">
									一键清空所有已导入策略、交易计划
								</p>
							</div>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button disabled={clearImportedStrategiesLoading}>
										{clearImportedStrategiesLoading ? "清空中..." : "一键清空"}
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											确定要清空已导入策略吗？
										</AlertDialogTitle>
										<AlertDialogDescription className="text-destructive font-semibold">
											该操作会影响正在进行的实盘，会重置所有实盘信息
										</AlertDialogDescription>
									</AlertDialogHeader>

									<AlertDialogFooter>
										<AlertDialogCancel>取消</AlertDialogCancel>
										<AlertDialogAction onClick={clearStrategies}>
											确定
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				)} */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label
							htmlFor="startup"
							className="font-medium text-sm hover:cursor-pointer"
						>
							自动打开客户端
						</Label>
						<p className="text-xs text-muted-foreground">
							电脑开机时自动打开量化小讲堂客户端。
						</p>
					</div>
					<Switch
						id="startup"
						checked={isAutoLogin}
						onCheckedChange={handleSetIsAutoLogin}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label
							htmlFor="is_auto_launch_update"
							className="font-medium text-sm hover:cursor-pointer"
						>
							自动更新数据
						</Label>
						<p className="text-xs text-muted-foreground">
							应用启动时开启自动更新数据。
						</p>
					</div>
					<Switch
						id="is_auto_launch_update"
						checked={isAutoLaunchUpdate}
						onCheckedChange={handleSetIsAutoLaunchUpdate}
					/>
				</div>

				{hasRealTradingAccess && (
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label
								htmlFor="is_auto_launch_real_trading"
								className="font-medium text-sm hover:cursor-pointer"
							>
								启动自动实盘
							</Label>
							<p className="text-xs text-muted-foreground">
								应用启动时开启自动实盘(开启后默认会开启自动数据更新配置)。
							</p>
						</div>
						<Switch
							id="is_auto_launch_real_trading"
							checked={isAutoLaunchRealTrading}
							onCheckedChange={handleSetIsAutoLaunchRealTrading}
						/>
					</div>
				)}

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label
							htmlFor="user_choice"
							className="font-medium text-sm hover:cursor-pointer"
						>
							退出时最小化
						</Label>
						<p className="text-xs text-muted-foreground">
							退出时最小化到系统托盘。
						</p>
					</div>

					<Switch
						id="user_choice"
						checked={userChoice}
						onCheckedChange={handleSetUserChoice}
					/>
				</div>
			</div>

			<Separator />

			<div>
				<div className="flex flex-col gap-4">
					<div className="text-muted-foreground">
						感谢以下同学参与到客户端的开发、测试中来 (以下排名不分先后)
					</div>

					<div className="grid grid-cols-4 gap-4">
						{contributorsList.map((item) => (
							<ContributorCard key={item.name} {...item} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

const ContributorCard = ({
	name,
	avatar,
	homepage,
	gourd,
}: {
	name: string
	avatar: string
	homepage: string
	gourd?: number
}) => {
	return (
		<div
			className="flex items-center gap-4  hover:underline hover:cursor-pointer"
			onClick={() => openUrl(homepage)}
		>
			<Avatar>
				<AvatarImage src={avatar} alt={name} />
				<AvatarFallback>{name[0]}</AvatarFallback>
			</Avatar>
			<div
				className={cn(
					"grid flex-1 text-left text-sm leading-tight",
					gourd === 1
						? "text-amber-500 dark:text-amber-300"
						: "text-gray-500 dark:text-gray-300",
				)}
			>
				<span className="truncate font-semibold">{name}</span>
				{gourd && (
					<div
						className={cn(
							"text-xs text-muted-foreground",
							gourd === 1
								? "text-amber-400 dark:text-amber-700"
								: "text-gray-400 dark:text-gray-500",
						)}
					>
						赠予 {gourd ?? 10} 个{gourd === 1 ? "金葫芦" : "银葫芦"}
					</div>
				)}
			</div>
		</div>
	)
}
