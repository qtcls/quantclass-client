/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { PerformanceModeSelectTabs } from "@/renderer/components/select-tabs"
import { AnimatedRainbowCard } from "@/renderer/components/ui/animated-rainbow-card"
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/renderer/components/ui/avatar"
import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import { Label } from "@/renderer/components/ui/label"
import { Separator } from "@/renderer/components/ui/separator"
import { Switch } from "@/renderer/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/renderer/components/ui/tabs"
import { useAlertDialog } from "@/renderer/context/alert-dialog"
import {
	useHandleTimeTask,
	usePermissionCheck,
	useToggleAutoRealTrading,
} from "@/renderer/hooks"
import { useAppVersions } from "@/renderer/hooks/useAppVersion"
import { useRealMarketConfig } from "@/renderer/hooks/useRealMarketConfig"
import { useRealTradingRole } from "@/renderer/hooks/useRealTradingRole"
import { useSettings } from "@/renderer/hooks/useSettings"
import { useVersionCheck } from "@/renderer/hooks/useVersionCheck"
import { cn } from "@/renderer/lib/utils"
import Contributors from "@/renderer/page/settings/contributors"
import { isAutoLoginAtom, versionListAtom } from "@/renderer/store/storage"
import { userAtom } from "@/renderer/store/user"
import { useLocalVersions, versionsAtom } from "@/renderer/store/versions"
import { AppVersions, KernalType, KernalVersionType } from "@/shared/types"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
	Blocks,
	Check,
	ChevronDown,
	ChevronUp,
	Circle,
	CircleArrowUp,
	DatabaseZap,
	FolderCode,
	Gift,
	LucideIcon,
	RefreshCcw,
	SquareFunction,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import Img from "../../../../build/icon.ico"

const useInvokeUpdateKernal = () => {
	const { updateKernal } = window.electronAPI
	const { refetchLocalVersions } = useLocalVersions()
	return async (kernal: KernalType, targetVersion?: string) => {
		const toastId = toast.loading(
			`更新 ${kernal} 内核到版本 ${targetVersion}...`,
		)
		console.log(`Updating ${kernal} to version ${targetVersion}`)

		try {
			const res = await updateKernal(kernal, targetVersion)
			if (res.success) {
				toast.success(`${kernal} 内核更新成功`, { id: toastId })
			} else {
				toast.warning(`${kernal} 内核更新异常`, {
					id: toastId,
					description: res.error,
				})
			}
		} catch (error) {
			toast.error(`${kernal} 内核更新失败`, { id: toastId })
		} finally {
			await refetchLocalVersions() // -- 更新后重新请求本地版本
		}
		return true
	}
}

const KernalVersionSelect = ({
	name,
	title,
	versionKey,
	versions = [],
	onVersionSelect,
}: {
	name: string
	title: string
	versionKey: string
	versions: KernalVersionType[]
	onVersionSelect?: (targetVersion: string, name: string) => void
}) => {
	const version = useAtomValue(versionsAtom)[versionKey]
	const useAlert = useAlertDialog()
	const versionLabels = {
		stable: {
			title: "稳定版",
			badge: "outline",
		},
		beta: {
			title: "测试版",
			badge: "outline-info",
		},
		pulled: {
			title: "已下线",
			badge: "secondary",
		},
	}
	return (
		<span
			className="text-xs text-muted-foreground cursor-pointer"
			onClick={() => {
				useAlert.open({
					title: `切换${title}(${name})内核？`,
					content: (
						<div className="space-y-3 leading-relaxed">
							{versions.map((remoteVersion) => (
								<div
									key={remoteVersion.version}
									className={cn(
										"border-1.5 rounded-lg px-3 py-2 cursor-pointer space-y-1",
										version === remoteVersion.version
											? "border-primary cursor-not-allowed"
											: "border-muted hover:bg-primary/10",
										"pulled" === remoteVersion.label &&
											"text-muted-foreground hover:bg-transparent",
									)}
									onClick={() => {
										if (
											version !== remoteVersion.version &&
											remoteVersion.label !== "pulled" &&
											onVersionSelect
										) {
											onVersionSelect?.(remoteVersion.version, name)
										}
									}}
								>
									<div className="font-medium flex items-center gap-1">
										{version === remoteVersion.version ? (
											<Check className="size-4 bg-primary text-primary-foreground rounded-full border-2 border-primary" />
										) : (
											<Circle className="size-4" />
										)}
										<span
											className={cn(
												"text-mono",
												version === remoteVersion.version && "font-bold",
											)}
										>
											{remoteVersion.version}
										</span>

										{remoteVersion.label &&
											versionLabels[remoteVersion.label] && (
												<Badge
													variant={versionLabels[remoteVersion.label].badge}
													className={cn(
														remoteVersion.label === "pulled" && "text-danger",
													)}
												>
													{versionLabels[remoteVersion.label].title}
												</Badge>
											)}
									</div>
									<div className="text-sm text-muted-foreground">
										<p>{remoteVersion.description}</p>
										<p>发布日期：{remoteVersion.release}</p>
									</div>
								</div>
							))}
						</div>
					),
					isContentLong: true,
				})
			}}
		>
			切换
		</span>
	)
}

const KernalVersion = ({
	name,
	title,
	Icon,
	versionKey,
	appVersions,
	disabled = false,
}: {
	name: string
	title: string
	Icon: LucideIcon
	versionKey: string
	appVersions: AppVersions | undefined
	disabled?: boolean
}) => {
	const version = useAtomValue(versionsAtom)
	const useAlert = useAlertDialog()
	const invokeUpdateKernal = useInvokeUpdateKernal()
	const handleTimeTask = useHandleTimeTask()
	const { isAutoRocket, handleToggleAutoRocket } = useToggleAutoRealTrading()
	const { killKernal } = window.electronAPI

	const latestVersion = useMemo(() => {
		return appVersions?.latest?.[name]
	}, [appVersions?.latest])

	const currentVersion = useMemo(() => {
		return version[versionKey]
	}, [version])

	const versionList = useMemo(() => {
		return appVersions?.[name] ?? []
	}, [appVersions?.[name]])

	const handleKernalUpdate = (targetVersion?: string, kernelName?: string) => {
		if (disabled) {
			toast.error(`当前操作系统不支持更新${title}内核`)
			return
		}
		const displayTargetVersion = targetVersion || "最新版本"
		const displayKernelName = kernelName || name

		useAlert.open({
			title: `更新${title}(${displayKernelName})内核？`,
			content: (
				<div className="space-y-3 leading-relaxed">
					<div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-lg px-3 py-2.5">
						<div className="flex items-center gap-2 text-blue-500">
							<CircleArrowUp className="size-4" />
							<span className="font-medium">版本更新提醒</span>
						</div>
						<p className="text-sm text-blue-500 mt-1">
							即将
							{currentVersion !== "暂无内核" && (
								<>
									从版本{" "}
									<span className="font-mono bg-blue-200 text-blue-600 px-1 py-0.5 rounded">
										{currentVersion}
									</span>{" "}
								</>
							)}
							更新到版本{" "}
							<span className="font-mono bg-blue-200 text-blue-600 px-1 py-0.5 rounded">
								{displayTargetVersion}
							</span>
						</p>
					</div>
					<p>
						🛑 下载内核前，会自动停止自动数据更新和实盘功能。完成后，需要
						<span className="text-warning">手动开启</span>。
					</p>
					<p>
						🔥 下载内核的时候，会强制退出运行中的{displayKernelName}
						进程，建议手动停止数据更新以及实盘功能后更新。
					</p>
					<p>⏩ 内核下载立即生效，建议盘后下载较为稳妥。</p>
					<p>💬 如果遇到问题，可以私信林奇或者夏普助教帮助。</p>
				</div>
			),
			okText: "立即更新",
			okDelay: 5,
			isContentLong: true,
			onOk: async () => {
				// 暂停数据更新和实盘功能
				await handleTimeTask(true, false)
				if (isAutoRocket) {
					await handleToggleAutoRocket(false, false)
				}

				await killKernal(kernelName as KernalType, true)

				await invokeUpdateKernal(kernelName as KernalType, targetVersion)
			},
		})
	}
	return (
		<div className="space-y-1">
			<h3 className="font-medium text-sm flex items-center gap-1">
				<Icon className="size-4" />
				{title}
				{latestVersion !== currentVersion && (
					<span
						className="text-xs text-blue-500 dark:text-blue-400 cursor-pointer"
						onClick={() => handleKernalUpdate(latestVersion, name)}
						title={`更新${title}(${name})内核到版本 ${latestVersion}`}
					>
						{currentVersion === "暂无内核" ? "下载" : "更新"}
					</span>
				)}
				{versionList.length > 0 && (
					<KernalVersionSelect
						name={name}
						title={title}
						versionKey={versionKey}
						versions={versionList}
						onVersionSelect={handleKernalUpdate}
					/>
				)}
			</h3>
			{disabled ? (
				<Badge variant="secondary" className="font-mono">
					{window.electron?.process?.platform === "darwin"
						? "macOS 不支持"
						: "当前操作系统不支持"}
				</Badge>
			) : (
				<Badge className="font-mono">{currentVersion}</Badge>
			)}
		</div>
	)
}

export default function SettingsPage() {
	const [showContributors, setShowContributors] = useState(false)
	const { user } = useAtomValue(userAtom)
	const { check } = usePermissionCheck()
	const hasRealTradingAccess = useRealTradingRole()
	const [isAutoLogin, setIsAutoLogin] = useAtom(isAutoLoginAtom)
	const version = useAtomValue(versionsAtom)
	const setVersionList = useSetAtom(versionListAtom)
	const { setAutoLaunch, openDataDirectory, killAllKernals } =
		window.electronAPI
	const handleTimeTask = useHandleTimeTask() // 数据任务控制
	const { isAutoRocket, handleToggleAutoRocket } = useToggleAutoRealTrading() // 自动交易控制

	const { settings, updateSettings } = useSettings()
	const { realMarketConfig, setPerformanceMode } = useRealMarketConfig()
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
		updateSettings({ user_choice: value })
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

	const { appVersions, isCheckingAppVersions, refetchAppVersions } =
		useAppVersions()

	const { refetchLocalVersions, isLoadingLocalVersions } = useLocalVersions()

	const useAlert = useAlertDialog()
	const invokeUpdateKernal = useInvokeUpdateKernal()
	const { getUpdateMessage, hasAnyUpdate } = useVersionCheck()

	const handleUpdateKernals = async () => {
		useAlert.open({
			title: "一键更新内核",
			content: (
				<div className="space-y-3 leading-relaxed">
					<AnimatedRainbowCard
						icon="✨"
						title="内核更新提示"
						description="即将为您更新所有内核到最新版本，请仔细阅读以下注意事项"
					/>
					<Separator />
					<p>
						🛑 更新前，会自动停止自动数据更新和实盘功能。在完成更新后，需要
						<span className="text-warning">手动开启</span>。
					</p>
					<p>
						🔥 更新内核的时候，会强制退出运行中的
						<span className="text-danger">所有内核</span>
						进程，建议手动停止数据更新以及实盘功能后更新。
					</p>
					<p>⏩ 内核更新立即生效，建议盘后更新较为稳妥。</p>
					<p>💬 如果遇到问题，可以私信林奇或者夏普助教帮助。</p>
				</div>
			),
			okText: "立即更新",
			okDelay: 10,
			onOk: async () => {
				await handleTimeTask(true, false)
				if (isAutoRocket) {
					await handleToggleAutoRocket(false, false)
				}

				await killAllKernals(true) // 强制杀死所有内核
				for (const kernal of [
					"fuel",
					settings.libraryType === "select" ? "aqua" : "zeus",
					"rocket",
				]) {
					await invokeUpdateKernal(kernal as KernalType)
				}
				await refetchLocalVersions()
				toast.success("内核更新完成", {
					duration: 4 * 1000,
				})
			},
		})
	}

	return (
		<div className="space-y-4 py-4">
			{hasAnyUpdate && (
				<AnimatedRainbowCard
					icon={<CircleArrowUp size={22} />}
					title="有可用更新"
					description={getUpdateMessage}
				/>
			)}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Avatar className="border bg-white dark:border-white ">
						<AvatarImage src={Img} alt="@shadcn" />
						<AvatarFallback>QC</AvatarFallback>
					</Avatar>

					<div className="space-y-1">
						<div className="font-semibold">量化小讲堂</div>
						<div className="text-sm flex items-center gap-1">
							<Badge className="font-mono h-5">v{version.clientVersion}</Badge>
							<span>｜</span>
							<span
								className="cursor-pointer text-muted-foreground"
								onClick={() => {
									setVersionList([])
								}}
							>
								客户端更新日志
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3">
					<KernalVersion
						name="fuel"
						title="数据内核"
						Icon={DatabaseZap}
						versionKey="fuelVersion"
						appVersions={appVersions}
					/>

					{hasRealTradingAccess && user?.isMember && (
						<>
							{settings.libraryType === "select" ? (
								<KernalVersion
									name="aqua"
									title="选股内核"
									Icon={SquareFunction}
									versionKey="aquaVersion"
									appVersions={appVersions}
								/>
							) : (
								<KernalVersion
									name="zeus"
									title="高级选股内核"
									Icon={SquareFunction}
									versionKey="zeusVersion"
									appVersions={appVersions}
								/>
							)}

							<KernalVersion
								name="rocket"
								title="下单内核"
								Icon={Blocks}
								versionKey="rocketVersion"
								appVersions={appVersions}
								disabled={window.electron?.process?.platform === "darwin"}
							/>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={isCheckingAppVersions || isLoadingLocalVersions}
					onClick={async () => {
						await refetchAppVersions()
						await refetchLocalVersions()
						toast.success("版本检查更新完成", {
							duration: 4 * 1000,
						})
					}}
				>
					<RefreshCcw
						className={cn(
							"size-4 mr-2",
							isCheckingAppVersions ||
								(isLoadingLocalVersions && "animate-spin"),
						)}
					/>
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
						await handleUpdateKernals()
					}}
				>
					<CircleArrowUp className="size-4 mr-2" />
					一键更新内核
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={async () => {
						await openDataDirectory("code")
					}}
				>
					<FolderCode className="size-4 mr-2" />
					打开文件夹
				</Button>
			</div>

			<div className="space-y-1">
				<Label className="font-medium text-sm hover:cursor-pointer flex items-center gap-1">
					<CircleArrowUp className="size-4" />
					更新说明
				</Label>
				<p className="text-xs text-muted-foreground">
					客户端会自动检查软件和内核更新，但
					<span className="text-success font-bold">不会自动更新</span>
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
					<PerformanceModeSelectTabs
						name="数据更新"
						defaultValue={settings.performance_mode || "EQUAL"}
						onValueChange={(value) => {
							updateSettings({ performance_mode: value })
						}}
					/>
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
					<PerformanceModeSelectTabs
						name="选股"
						defaultValue={realMarketConfig.performance_mode || "EQUAL"}
						onValueChange={(value) => {
							setPerformanceMode(value)
						}}
					/>
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
						checked={settings.user_choice}
						onCheckedChange={handleSetUserChoice}
					/>
				</div>
			</div>

			<Separator />

			<div>
				<div className="flex items-center justify-between">
					<Label
						htmlFor="show_contributors"
						className="font-medium text-sm hover:cursor-pointer flex items-center gap-1"
						onClick={() => setShowContributors(!showContributors)}
					>
						<Gift className="size-4" />
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
