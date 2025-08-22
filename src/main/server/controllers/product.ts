/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import store from "@/main/store/index.js"
import logger from "@/main/utils/wiston.js"
import { sql } from "drizzle-orm"
import type { Context } from "hono"
import { productStatus } from "../schema/index.js"
import type { ColumnInfo, Env } from "../types/index.js"

export async function getProductStatus(c: Context<Env>) {
	const db = c.var.db

	if (!db) {
		logger.error("数据库连接失败")
		return c.json({
			code: 500,
			message: "数据库连接失败",
			data: [],
		})
	}

	try {
		const dat = db.all<ColumnInfo>("PRAGMA table_info(product_status)")

		if (!dat.some((item) => item.name === "ts")) {
			logger.info("缺少ts列，正在添加")
			db.run(sql`ALTER TABLE product_status ADD COLUMN ts TEXT`)
		}

		const rawData = db.select().from(productStatus).all()

		const data = rawData.map((item) => ({
			name: item.name,
			displayName: item.displayName,
			fullData: item.full_data,
			lastUpdateTime: item.last_update_time,
			nextUpdateTime: item.next_update_time,
			dataTime: item.data_time,
			dataContentTime: item.data_content_time,
			isAutoUpdate: item.is_auto_update,
			canAutoUpdate: item.can_auto_update,
			addTime: item.add_time,
			isListed: item.is_listed,
			fullDataDownloadUrl: item.full_data_download_url,
			fullDataDownloadExpires: item.full_data_download_expires,
			ts: item.ts ?? "",
		}))

		const data_white_list = (await store.getValue(
			"settings.data_white_list",
			[],
		)) as string[]

		const filteredData = data.filter((item) =>
			data_white_list.includes(item.name ?? ""),
		)

		return c.json({
			code: 200,
			message: "success",
			data: filteredData,
		})
	} catch (error) {
		logger.error(`查询产品状态失败: ${error}`)
		return c.json({
			code: 500,
			message: "查询产品状态失败",
			data: [],
		})
	}
}
