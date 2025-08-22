/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export interface FileAPI {
	openFile: () => void
	sendUpdateStatus: (callback: (event: any, data: any) => void) => Promise<void>
	onNetworkStatusChange: (
		callback: (event: any, data: boolean) => void,
	) => Promise<void>
	startNetworkCheck: () => Promise<void>
	stopNetworkCheck: () => Promise<void>
	senderPythonOutPut: (
		callback: (event: any, data: any) => void,
	) => Promise<void>
	sendVersionUpdate: (
		callback: (event: any, data: any) => void,
	) => Promise<void>
	getStrategySelectData: () => Promise<IGetStrategyDataRes>
	toggleHandler: (isUpdating: boolean) => any
	openDirectory: (path: any) => Promise<void>
}

export type IGetStrategyDataRes = Array<{
	category: any
	config: IGetStrategyDataResItemConfig
	displayName: string
	fullName: string
	id: string
	name: string
}>

export type IGetStrategyDataResItemConfig = Array<{
	name: string
	title: string
	values: number[] | string[]
}>
