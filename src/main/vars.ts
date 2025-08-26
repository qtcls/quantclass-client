/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import pkg from "../../package.json"

// 在 Electron 主进程中，环境变量应该从 process.env 获取
export const BASE_URL = process.env.VITE_BASE_URL || "https://api.quantclass.cn"

// 应用版本信息
export const CLIENT_VERSION = pkg.version
export const PACKAGE_INFO = pkg
