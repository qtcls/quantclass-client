/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import logger from "@/main/utils/wiston.js"
import type { MiddlewareHandler } from "hono"

export const errorHandler = (): MiddlewareHandler => {
	return async (c, next) => {
		try {
			await next()
			return c.json({
				code: 200,
				message: "成功",
				data: null,
			})
		} catch (err) {
			logger.error(`服务器错误: ${err}`)
			return c.json({
				code: 500,
				message: "服务器内部错误",
				data: null,
			})
		}
	}
}
