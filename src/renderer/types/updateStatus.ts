/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { UpdateInfo } from "electron-updater"

// 更新信息的回调函数类型
export type UpdateInfoCallback = (info: UpdateInfo) => void

// 更新相关的 IPC 方法类型
export interface UpdateIPC {
	startUpdate: () => void
	cancelUpdate: () => void
	onUpdateInfo: (callback: UpdateInfoCallback) => void
	unUpdateInfoListener: () => void
}
