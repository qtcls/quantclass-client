/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

// -- 持仓周期白名单
export const ALLOWED_HOLD_PERIODS = {
	day: [
		// -- 按天
		"2D",
		"3D",
		"4D",
		"5D",
		"10D",
	],
	week: [
		// -- 按周
		"W",
		"2W",
		"3W",
		"4W",
		"5W",
		"6W",
	],
	month: [
		// -- 按月
		"M",
	],
} as const

// -- 持仓频率选项
export const FREQUENCY_OPTIONS = [
	{ value: "day", label: "按天" },
	{ value: "week", label: "按周" },
	{ value: "month", label: "按月" },
] as const

// -- 判断 hold_period 属于哪种类型
export const getHoldPeriodType = (holdPeriod: any) => {
	// -- 判断是否在 day 列表中
	if (ALLOWED_HOLD_PERIODS.day.includes(holdPeriod?.toUpperCase())) {
		return "day"
	}
	// -- 判断是否在 week 列表中
	if (ALLOWED_HOLD_PERIODS.week.includes(holdPeriod?.toUpperCase())) {
		return "week"
	}
	// -- 判断是否在 month 列表中
	if (ALLOWED_HOLD_PERIODS.month.includes(holdPeriod?.toUpperCase())) {
		return "month"
	}
	// -- 如果都不在，返回 undefined
	return undefined
}
