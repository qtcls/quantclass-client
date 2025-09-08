/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

/**
 * 核心版本信息类型
 */
export interface CoreVersionType {
	description: string
	download: string
	version: string
	release: string
}

/**
 * 应用版本信息类型
 */
export interface AppVersions {
	client: string
	latest: Record<string, string>
	downloads: Record<string, string>
	app: CoreVersionType
	fuel: CoreVersionType[]
	aqua: CoreVersionType[]
	zeus: CoreVersionType[]
	rocket: CoreVersionType[]
}
