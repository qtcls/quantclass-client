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
import { usePermissionCheck, useQueryVersion } from "@/renderer/hooks"
import { useRealTradingRole } from "@/renderer/hooks/useRealTradingRole"
import { useSettings } from "@/renderer/hooks/useSettings"
import {
	isAutoLoginAtom,
	userChoiceAtom,
	versionAtom,
} from "@/renderer/store/storage"
import { userAtom } from "@/renderer/store/user"
import { useAtom, useAtomValue } from "jotai"
import {
	Blocks,
	ChevronDown,
	ChevronUp,
	CircleArrowUp,
	DatabaseZap,
	LucideIcon,
	RefreshCcw,
	SquareFunction,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import Img from "../../../../build/icon.ico"
import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/renderer/components/ui/tabs"
import Contributors from "@/renderer/page/settings/contributors"
import { useAlertDialog } from "@/renderer/context/alert-dialog"

const { setStoreValue, setAutoLaunch } = window.electronAPI

const CoreVersion = ({
	name,
	title,
	Icon,
	versionKey,
}: { name: string; title: string; Icon: LucideIcon; versionKey: string }) => {
	const version = useAtomValue(versionAtom)
	const useAlert = useAlertDialog()
	return (
		<div className="space-y-1">
			<h3 className="font-medium text-sm flex items-center gap-1">
				<Icon className="size-4" />
				{title}
				<span
					className="text-xs text-blue-500 dark:text-blue-400 cursor-pointer"
					onClick={() => {
						useAlert.open({
							title: `更新${title}(${name})内核？`,
							content: (
								<div className="space-y-3 leading-relaxed">
									<div className="bg-warning-50 dark:bg-warning/20 border border-warning rounded-lg px-3 py-2.5">
										<div className="flex items-center gap-2 text-warning">
											<span className="text-lg">⚠️</span>
											<span className="font-medium">版本更新提醒</span>
										</div>
										<p className="text-sm text-warning mt-1">
											即将从版本{" "}
											<span className="font-mono bg-warning-200 text-warning-600 px-1 py-0.5 rounded">
												{version[versionKey]}
											</span>{" "}
											更新到最新版本
										</p>
									</div>
									<Separator />
									<p>
										🛑
										更新前，会自动停止自动数据更新和实盘功能。在完成更新后，需要
										<span className="text-warning">手动开启</span>。
									</p>
									<p>
										🔥 更新内核的时候，会强制退出运行中的{name}
										进程，建议手动停止数据更新以及实盘功能后更新。
									</p>
									<p>⏩ 内核更新立即生效，建议盘后更新较为稳妥。</p>
									<p>💬 如果遇到问题，可以私信林奇或者夏普助教帮助。</p>
								</div>
							),
							okText: "立即更新",
							okDelay: 5,
						})
					}}
				>
					更新
				</span>
				<span className="text-xs text-muted-foreground cursor-pointer">
					更换
				</span>
			</h3>
			<Badge className="font-mono">{version[versionKey]}</Badge>
		</div>
	)
}

export default function SettingsPage() {
	const [showContributors, setShowContributors] = useState(false)
	const { user } = useAtomValue(userAtom)
	const { check } = usePermissionCheck()
	const hasRealTradingAccess = useRealTradingRole()
	const [isAutoLogin, setIsAutoLogin] = useAtom(isAutoLoginAtom)
	const version = useAtomValue(versionAtom)

	const [userChoice, setUserChoice] = useAtom(userChoiceAtom)
	const { runAsync: updateKernels, loading: isUpdatingKernels } =
		useQueryVersion()
	const { settings, updateSettings } = useSettings()

	const isAutoLaunchRealTrading = useMemo(() => {
		return settings.is_auto_launch_real_trading
	}, [settings.is_auto_launch_real_trading])

	const isAutoLaunchUpdate = useMemo(() => {
		return settings.is_auto_launch_update
	}, [settings.is_auto_launch_update])

	const handleSetIsAutoLaunchUpdate = async (value: boolean) => {
		updateSettings({ is_auto_launch_update: value })
		if (!value) {
			updateSettings({ is_auto_launch_real_trading: false })
		}
		toast.dismiss()
		toast.success(value ? "自动更新已开启" : "自动更新已关闭")
	}

	const handleSetIsAutoLaunchRealTrading = async (value: boolean) => {
		if (!check({ requireMember: true, onlyIn2025: true }).isValid) return

		updateSettings({ is_auto_launch_real_trading: value })
		if (value) {
			updateSettings({ is_auto_launch_update: true })
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
		<div className="space-y-4 py-4">
			<div className="space-y-4">
				{/* <div className="text-sm text-muted-foreground">版本</div> */}

				<div className="flex items-center gap-3">
					<Avatar className="border bg-white dark:border-white ">
						<AvatarImage src={Img} alt="@shadcn" />
						<AvatarFallback>QC</AvatarFallback>
					</Avatar>

					<div className="">
						<div className="font-semibold">量化小讲堂</div>
						<div className="text-sm text-muted-foreground">
							v{version.clientVersion}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3">
					<CoreVersion
						name="fuel"
						title="数据内核"
						Icon={DatabaseZap}
						versionKey="coreVersion"
					/>

					{hasRealTradingAccess && user?.isMember && (
						<>
							{settings.libraryType === "select" ? (
								<CoreVersion
									name="aqua"
									title="选股内核"
									Icon={SquareFunction}
									versionKey="aquaVersion"
								/>
							) : (
								<CoreVersion
									name="zeus"
									title="高级选股内核"
									Icon={SquareFunction}
									versionKey="zeusVersion"
								/>
							)}

							<CoreVersion
								name="rocket"
								title="下单内核"
								Icon={Blocks}
								versionKey="rocketVersion"
							/>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm">
					<RefreshCcw className="size-4 mr-2" />
					检查更新
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={async () => {
						if (!user?.isMember) {
							toast.dismiss()
							toast.error("请先登录")
							return
						}
						await fetchFuel()
						await updateKernels()
					}}
				>
					<CircleArrowUp className="size-4 mr-2" />
					一键更新内核
				</Button>
			</div>

			<div className="space-y-1">
				<Label className="font-medium text-sm hover:cursor-pointer flex items-center gap-1">
					ℹ️ 更新说明
				</Label>
				<p className="text-xs text-muted-foreground">
					客户端会自动检查软件和内核更新，但
					<span className="text-warning">不会自动更新</span>
					。更新后遇到问题，也可以在上方回退任意适配的历史版本。
				</p>
			</div>

			<Separator />

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label className="font-medium text-sm hover:cursor-pointer flex items-center gap-1">
							<DatabaseZap className="size-4" />
							数据更新性能
						</Label>
						<p className="text-xs text-muted-foreground">
							数据更新性能，性能越高，数据更新速度越快，但会占用更多性能。
						</p>
					</div>
					<Tabs
						defaultValue={settings.performance_mode || "EQUAL"}
						onValueChange={(value) => {
							updateSettings({
								performance_mode: value as "ECONOMY" | "EQUAL" | "PERFORMANCE",
							})
							toast.success(
								`数据更新性能模式设置为${value === "ECONOMY" ? "经济模式" : value === "EQUAL" ? "均衡模式" : "性能模式"}`,
							)
						}}
					>
						<TabsList>
							<TabsTrigger value="ECONOMY">经济</TabsTrigger>
							<TabsTrigger value="EQUAL">均衡</TabsTrigger>
							<TabsTrigger value="PERFORMANCE">性能</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label className="font-medium text-sm hover:cursor-pointer flex items-center gap-1">
							<SquareFunction className="size-4" />
							选股性能模式
						</Label>
						<p className="text-xs text-muted-foreground">
							选股性能模式，性能越高，选股速度越快，但会占用更多性能。
						</p>
					</div>
					<Tabs
						defaultValue={settings.performance_mode || "EQUAL"}
						onValueChange={(value) => {
							updateSettings({
								performance_mode: value as "ECONOMY" | "EQUAL" | "PERFORMANCE",
							})
							toast.success(
								`数据更新性能模式设置为${value === "ECONOMY" ? "经济模式" : value === "EQUAL" ? "均衡模式" : "性能模式"}`,
							)
						}}
					>
						<TabsList>
							<TabsTrigger value="ECONOMY">经济</TabsTrigger>
							<TabsTrigger value="EQUAL">均衡</TabsTrigger>
							<TabsTrigger value="PERFORMANCE">性能</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
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
				<div className="flex items-center justify-between">
					<Label className="font-medium text-sm hover:cursor-pointer">
						特别鸣谢贡献者
					</Label>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => setShowContributors(!showContributors)}
					>
						{showContributors ? (
							<ChevronUp className="size-4" />
						) : (
							<ChevronDown className="size-4" />
						)}
					</Button>
				</div>

				{showContributors && <Contributors />}
			</div>
		</div>
	)
}
