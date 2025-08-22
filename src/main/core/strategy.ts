/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

// import { checkFuelExist } from "@/main/core/runpy.js"
import { execBin } from "@/main/lib/process.js"
import { isCoreBusy } from "@/main/utils/tools.js"
import logger from "@/main/utils/wiston.js"

// 增量更新和定时增量更新
export async function updateStrategies(strategy?: string, manual = "manual") {
	try {
		logger.info(`check pycore exist before update ${strategy}`)
		// await checkFuelExist()
		logger.info(`manually update ${strategy}`)

		const isFuelBusy = await isCoreBusy("fuel")

		!isFuelBusy && strategy
			? await execBin(["one_strategy", strategy], `更新策略-${strategy}`)
			: await execBin(["all_strategy", manual], "更新全部策略")

		return {
			status: "success",
			message: `执行 ${strategy ?? "全部"} 策略数据增量更新`,
		}
	} catch (error) {
		logger.error(error)
	}

	return {
		status: "error",
		message: `执行 ${strategy ?? "全部"} 不成功`,
	}
}
