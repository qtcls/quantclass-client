/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { IRes } from "@/main/server/types/index.js"
import type { UpdateCheckResult } from "electron-updater"

export interface Versions {
	node: () => string
	chrome: () => string
	electron: () => string
}

export interface BaseAPI {
	logHandle: (
		msg: Partial<{
			message: string | Event
			source: string
			lineno: number
			colno: number
			error: Error
		}>,
	) => void
	handleExecDownloadZip: (product_name: string) => Promise<string>
	execFuelWithEnv: (
		args: string[],
		action: string,
		// kernel?: "rocket" | "real_trading" | "fuel" | "aqua",
		kernel?: "rocket" | "fuel" | "aqua" | "zeus",
		extraEnv?: string,
	) => Promise<{ message: string; code: number }>
	fetchFullscreenState: () => Promise<boolean>
	handleToggleFullscreen: () => Promise<void>
	openUrl: (url: string) => void
	forceKillAllProcesses: () => Promise<void>
	createStrategyDir: () => Promise<string>
	createRealTradingDir: (dirName?: string) => Promise<string>
	checkFuelUpdateLockFile: () => Promise<{ pending: boolean }>
	getCoreAndClientVersion: (isMember: boolean) => any
	calcTradingPlan: () => Promise<{ message: string; code: number }>
	rocketExecute: () => Promise<{ message: string; code: number }>
	loadPosition: () => Promise<any>
	getSelectedStrategiesList: () => Promise<any[]>
	getTradingPlanList: () => Promise<any[]>
	checkUpdate: () => Promise<UpdateCheckResult>
	reportError: (
		cb: (
			res: IRes & { msgType: "info" | "success" | "warning" | "error" },
		) => void,
	) => void
	removeReportErrorListener: () => void
	setAutoTrading: (isAutoTrading: boolean) => void
}

// export interface ElectronAPI {
//     syncNetworkStatus: (isOnline: boolean) => void
// }
