/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export type { BaseAPI, Versions } from "./base.js"
export type {
	FileAPI,
	IGetStrategyDataRes,
	IGetStrategyDataResItemConfig,
} from "./file.js"
export type { PowerMonitor, PowerMonitorAPI } from "./powerMonitor.js"
export type { ProductUpdateAPI } from "./productUpdate.js"
export type {
	LoopStatus,
	ScheduleStatusAPI,
} from "./scheduleStatus.js"
export type { InitialValueType, StoreAPI } from "./store.js"
export type { SystemAPI } from "./system.js"
export * from "./updateStatus.js"
export type { SettingsType } from "./settings.js"

export interface UserInfo {
	id: string
	uuid: string
	apiKey: string
	headimgurl: string
	isMember: boolean
	// 参加小组信息
	groupInfo: string[]
	nickname: string
	membershipInfo: string[]
	approval: {
		block: boolean
		crypto: boolean
		stock: boolean
	}
}

export interface UserState {
	token: string
	user: UserInfo | null
	isLoggedIn: boolean
}

// 定义一个基础策略类型
export interface BaseStrategy {
	name: string
	offset_list: (string | number)[]
	factors?: Record<string, string[]>
	select_num: number | string
	cap_weight: number
	info?: string
	update_time?: string
	isDefault?: boolean
}
