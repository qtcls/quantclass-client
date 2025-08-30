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
import { usePermissionCheck } from "@/renderer/hooks"
import { useRealTradingRole } from "@/renderer/hooks/useRealTradingRole"
import {
	isAutoLoginAtom,
	userChoiceAtom,
	versionAtom,
} from "@/renderer/store/storage"
import { userAtom } from "@/renderer/store/user"
import { useAtom, useAtomValue } from "jotai"
import {
	Ban,
	Blocks,
	CodeXml,
	DatabaseZap,
	ShieldCheck,
	SquareFunction,
	ChevronUp,
	ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import Img from "../../../../build/icon.ico"
import { Badge } from "../ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useSettings } from "@/renderer/hooks/useSettings"
import { useMemo, useState } from "react"
import Contributors from "./contributors"
import { Button } from "../ui/button"

const { setStoreValue, setAutoLaunch } = window.electronAPI

export default function AboutInfo() {
	const [showContributors, setShowContributors] = useState(false)
	const { user } = useAtomValue(userAtom)
	const { check } = usePermissionCheck()
	const hasRealTradingAccess = useRealTradingRole()
	const version = useAtomValue(versionAtom)
	const [isAutoLogin, setIsAutoLogin] = useAtom(isAutoLoginAtom)

	const [userChoice, setUserChoice] = useAtom(userChoiceAtom)
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

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label className="font-medium text-sm hover:cursor-pointer">
							内核更新设置
						</Label>
						<p className="text-xs text-muted-foreground">
							选择如何自动更新客户端内核，开发版会包含所有最新功能
						</p>
					</div>
					<Tabs
						defaultValue={settings.update_core_channel || "never"}
						onValueChange={(value) => {
							updateSettings({
								update_core_channel: value as "never" | "stable" | "beta",
							})
							toast.success(
								`内核更新设置为${value === "never" ? "不更新" : value === "stable" ? "稳定版" : "开发版"}`,
							)
						}}
					>
						<TabsList>
							<TabsTrigger value="never">
								<Ban className="size-4 mr-1" />
								不更新
							</TabsTrigger>
							<TabsTrigger value="stable">
								<ShieldCheck className="size-4 mr-1 text-success" />
								稳定版
							</TabsTrigger>
							<TabsTrigger value="beta">
								<CodeXml className="size-4 mr-1 text-warning" />
								开发版
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label className="font-medium text-sm hover:cursor-pointer">
							数据更新性能模式
						</Label>
						<p className="text-xs text-muted-foreground">
							数据更新性能模式，开启后会自动更新数据，但会占用更多性能。
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
							<TabsTrigger value="ECONOMY">经济模式</TabsTrigger>
							<TabsTrigger value="EQUAL">均衡模式</TabsTrigger>
							<TabsTrigger value="PERFORMANCE">性能模式</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label className="font-medium text-sm hover:cursor-pointer">
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
							<TabsTrigger value="ECONOMY">经济模式</TabsTrigger>
							<TabsTrigger value="EQUAL">均衡模式</TabsTrigger>
							<TabsTrigger value="PERFORMANCE">性能模式</TabsTrigger>
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
