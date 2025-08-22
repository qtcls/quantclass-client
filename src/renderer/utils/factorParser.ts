/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

// -- 解析因子字符串并返回解释
export function parseFactorString(factor: string): string {
	if (!factor) return ""
	const [period, offset, stockCount] = factor.split("_")

	let holdingPeriod = ""
	let offsetText = ""
	let stockCountText = ""

	// -- 解析持仓周期
	if (period.includes("W")) {
		const weeks = period === "W" ? 1 : Number.parseInt(period.slice(1))
		holdingPeriod = `持仓${weeks}周`

		if (period.length === 3) {
			holdingPeriod = `${holdingPeriod}，周${period[2]}买入，次周${period[2]}卖出`
		}
	} else if (period.startsWith("M")) {
		holdingPeriod = "持仓1月"
	} else {
		const days = Number.parseInt(period)
		holdingPeriod = `持仓${days}天`
	}

	// -- 解析 offset
	if (offset === "0") {
		offsetText = period.startsWith("M") ? "月初换仓" : "offset-0"
	} else if (offset === "-5" && period.startsWith("M")) {
		offsetText = "最后一个周五换仓"
	} else {
		offsetText = `offset-${offset}`
	}

	// -- 解析股票数量（如果有）
	if (stockCount) {
		stockCountText =
			stockCount === "@"
				? "子策略选股数量是任意的"
				: `子策略选${stockCount}个股票`
	}

	// -- 组合最终的解释文本
	let explanation = `${holdingPeriod}，${offsetText}`
	if (stockCountText) {
		explanation += `，${stockCountText}`
	}

	return explanation
}
