/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export type LoopStatus =
	| "init"
	| "start"
	| "outline"
	| "check"
	| "rocket_updating"
	| "rocket_start"
	| "fuel_updating"
	| "fuel_start"
	| "aqua_updating"
	| "aqua_start"
	| "noTradingTime"
	| "online"
	| "done"

export interface ScheduleStatusAPI {
	subscribeScheduleStatus: (
		callback: (event: any, status: LoopStatus) => void,
	) => Promise<void>
	unSubscribeSendScheduleStatusListener: () => void
	removePythonDependenceInstallCloseListener: () => void
	setPythonDependenceInstallClose: (
		callback: (isOpen: boolean, status: "success" | "error") => void,
	) => any
}
