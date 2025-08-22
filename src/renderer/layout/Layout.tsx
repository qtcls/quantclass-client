/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import AboutDialog from "@/renderer/components/About/AboutDialog"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { type FC, useEffect } from "react"
import { Outlet, useLocation } from "react-router"

import {
	useGlobalValue,
	useLifeCycle,
	useNetInterval,
	useNetworkToast,
	useQueryVersion,
	useRouterGuard,
} from "@/renderer/hooks"

import {
	isFullscreenAtom,
	isShowAboutAtom,
	isShowMonitorPanelAtom,
	loadingAnimeAtom,
} from "@/renderer/store"

import LoadingAnime from "@/renderer/components/LoadingAnime"
import MonitorDialog from "@/renderer/components/MonitorDialog"
import { Badge } from "@/renderer/components/ui/badge"
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
} from "@/renderer/components/ui/sidebar"
import { useCalcTotalWeight } from "@/renderer/hooks/useCalcTotalWeight"
// import { useClassStatusInterval } from "@/renderer/hooks/useClassStatusInterval"
import { Footer } from "@/renderer/layout/Footer"
import { UserMenu } from "@/renderer/layout/UserMenu"
import { libraryTypeAtom } from "@/renderer/store/storage"
import { _BreadCrumb } from "./BreadCrumb"
import { _SidebarContent } from "./Content"
import { _SiderFooter } from "./Footer"
import WindowsBar from "./WindowsBar"
import { useReportErr } from "./hooks/useReportErr"

// -- Utils & Constants
import { AlertDialogProvider } from "@/renderer/context/alert-dialog"
import { ConfirmChangeLibrary } from "@/renderer/layout/ConfirmChangeLibrary"
import { ChangeLibrary } from "@/renderer/layout/changeLibrary"
import VersionUpgrade from "@/renderer/layout/version-upgrade"
import { cn } from "@/renderer/lib/utils"
import { Check } from "lucide-react"

const { handleToggleFullscreen } = window.electronAPI

// -- Types
interface MainLayoutProps {
	pathname: string
	loading: boolean
	content: string | undefined
	isShowAbout: boolean
	setIsShowAbout: (value: boolean) => void
	isShowMonitorPanel: boolean
}

const Layout: FC = () => {
	useGlobalValue()
	useRouterGuard()
	useNetInterval()
	useLifeCycle()
	// useMigrateStrategyData()
	useCalcTotalWeight()
	// useClassStatusInterval()
	useNetworkToast()

	// -- State & Atoms
	const { pathname } = useLocation()
	const [loading] = useAtom(loadingAnimeAtom)
	const setIsFullscreen = useSetAtom(isFullscreenAtom)
	const [isShowAbout, setIsShowAbout] = useAtom(isShowAboutAtom)
	const isShowMonitorPanel = useAtomValue(isShowMonitorPanelAtom)
	const { content } = useReportErr()

	// -- Hooks
	const { run: queryVersion } = useQueryVersion()

	// -- Effects
	useEffect(() => {
		queryVersion()
	}, [pathname])

	// -- Handlers
	const toggleFullscreen = () => {
		handleToggleFullscreen()
		setIsFullscreen((prev) => !prev)
	}

	return (
		<>
			<WindowsBar toggleFullscreen={toggleFullscreen} />

			<SidebarProvider className="h-[calc(100svh-2.5rem)] min-h-[calc(100svh-2.5rem)] dddd">
				<Sidebar
					// variant="floating"
					collapsible="none"
					className="h-[calc(100svh-2.5rem)] bottom-0 top-10 border-r"
				>
					<_SidebarContent />
					<_SiderFooter />
					<SidebarRail />
				</Sidebar>

				<MainLayout
					pathname={pathname}
					loading={loading}
					content={content}
					isShowAbout={isShowAbout}
					setIsShowAbout={setIsShowAbout}
					isShowMonitorPanel={isShowMonitorPanel}
				/>
			</SidebarProvider>
			<VersionUpgrade />
			<ConfirmChangeLibrary />
		</>
	)
}

export default Layout

const MainLayout: FC<MainLayoutProps> = ({
	pathname,
	loading,
	content,
	isShowAbout,
	setIsShowAbout,
	isShowMonitorPanel,
}) => {
	useLocation()
	const libraryType = useAtomValue(libraryTypeAtom)
	const pathList = [
		{
			pathname: "/strategy_library",
			libraryType: "select",
		},
		{
			pathname: "/position_strategy_library",
			libraryType: "pos",
		},
	]
	// 找到当前 pathname 对应的 pathList 项
	const currentPath = pathList.find((item) => item.pathname === pathname)
	return (
		<SidebarInset className="min-h-[calc(100svh-2.5rem-1px)] h-[calc(100svh-2.5rem-1px)] overflow-y: auto">
			<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
				{/* <SidebarTrigger className="-ml-1 text-muted-foreground size-5" />
				<Separator orientation="vertical" className="mr-2 h-4" /> */}
				<div className="flex items-center gap-10">
					<_BreadCrumb />
					{currentPath && libraryType !== currentPath.libraryType && (
						<ChangeLibrary isButton={true} />
					)}
					{currentPath && libraryType === currentPath.libraryType ? (
						<Badge
							variant="outline"
							className="py-1 px-1.5 ml-auto flex items-center gap-1 text-success border-success"
						>
							<Check size={14} />
							<span>已启用</span>
						</Badge>
					) : null}
				</div>
				<div className="ml-auto flex items-center gap-2">
					<UserMenu />
				</div>
			</header>

			<AboutDialog open={isShowAbout} onOpenChange={setIsShowAbout} />
			<LoadingAnime loading={loading} content={content} type="coreUpdate" />
			<AlertDialogProvider>
				<div
					className={cn(
						"px-4 h-full max-w-[calc(100vw - 10rem - 2em)] max-h-[calc(100vh - 8.5rem - 1px)] overflow-auto flex-1 flex-col space-y-4 md:flex ",
					)}
				>
					<Outlet />
				</div>
				{isShowMonitorPanel && <MonitorDialog />}
			</AlertDialogProvider>
			<Footer />
		</SidebarInset>
	)
}
