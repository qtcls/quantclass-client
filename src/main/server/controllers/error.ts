/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import windowManager from "@/main/lib/WindowManager.js"
import logger from "@/main/utils/wiston.js"
import type { Context } from "hono"
import type { IRes } from "../types/index.js"

export async function reportError(c: Context) {
	const body: IRes = await c.req.json()
	logger.warn("error", JSON.stringify(body))

	const mainWindow = windowManager.getWindow()
	mainWindow?.webContents.send("report-msg", body)

	return c.json({ ...body })
}
