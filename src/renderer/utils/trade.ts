/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import type { TimeValue } from "react-aria"
// import { parseToTimeValueWithSecond } from "."
dayjs.extend(isBetween)

export function parseRebalanceTime(rebalance_time: string) {
	if (rebalance_time === "close") {
		return {
			sell_point: "close",
			buy_point: "close",
		}
	}

	if (rebalance_time === "open") {
		return {
			sell_point: "open",
			buy_point: "open",
		}
	}

	const [sell_point, buy_point] = rebalance_time.split("-")

	return {
		sell_point,
		buy_point,
	}
}

export const generateRandomTimeValue = (
	hour: number,
	minStart: number,
	minEnd: number,
) => {
	const minuteRange: Array<{ hour: number; minute: number }> = []

	// 统一处理：允许 minStart < 0（上小时）以及 minEnd >= 60（下小时）
	for (let m = minStart; m <= minEnd; m++) {
		// 计算小时偏移：支持任意跨小时（例如 -5, 70 等）
		const hourOffset = Math.floor(m / 60)
		// 归一化分钟到 0..59，兼容负数取模
		const normalizedMinute = ((m % 60) + 60) % 60
		minuteRange.push({ hour: hour + hourOffset, minute: normalizedMinute })
	}

	const randomIndex = Math.floor(Math.random() * minuteRange.length)
	const { hour: finalHour, minute: finalMinute } = minuteRange[randomIndex]
	const second = Math.floor(Math.random() * 60)
	return { hour: finalHour, minute: finalMinute, second } as TimeValue
}

export function genAutoTradeTime(sell_point: string, buy_point: string) {
	let sell_time: TimeValue
	let buy_time: TimeValue
	switch (sell_point) {
		case "close":
			sell_time = generateRandomTimeValue(14, 50, 55) // 隔日场景下,需要50之后;尾盘换仓的场景下,提供一个兜底卖出时间,也需要是50之后
			break
		case "open":
			sell_time = generateRandomTimeValue(9, 30, 40)
			break
		default: {
			const hour = Number.parseInt(sell_point.slice(0, 2))
			const minute = Number.parseInt(sell_point.slice(2, 4))
			sell_time = generateRandomTimeValue(hour, minute - 1, minute + 10)
			break
		}
	}

	if (buy_point === "open" && sell_point === "close") {
		// 夏普让我修复一下close-open的问题：2025年7月14日
		buy_time = generateRandomTimeValue(9, 30, 40)
	} else {
		// 买入时间在卖出时间之后 60 -> 120s
		const sell_seconds =
			sell_time.hour * 3600 + sell_time.minute * 60 + sell_time.second

		const buy_seconds = sell_seconds + 60 + Math.floor(Math.random() * 60)
		buy_time = {
			hour: Math.floor(buy_seconds / 3600),
			minute: Math.floor((buy_seconds % 3600) / 60),
			second: buy_seconds % 60,
		} as TimeValue
	}
	return { sell_time, buy_time }
}

export function autoTradeTimeByRebTime(rebalance_time: string) {
	const { sell_point, buy_point } = parseRebalanceTime(rebalance_time)
	return genAutoTradeTime(sell_point, buy_point)
}

export const validateTradeTime = (
	// rebalance_time: "close-open" | "open" | "close",
	rebalance_time: string,
	buyTime: string,
	sellTime: string,
) => {
	const buyTimeObj = dayjs(`2000-01-01 ${buyTime}`)
	const sellTimeObj = dayjs(`2000-01-01 ${sellTime}`)

	switch (rebalance_time) {
		case "close-open": // -- 隔日换仓
			return (
				// -- 买入时间: 09:24:30-09:40:00 或 9:50之后
				buyTimeObj.isBetween(
					dayjs("2000-01-01 09:24:30"),
					dayjs("2000-01-01 09:50:00"),
					"second",
					"[]",
				) &&
				// -- 卖出时间: 14:50:00-14:55:00 或 14:40:00之前 或 14:56:30之后
				sellTimeObj.isBetween(
					dayjs("2000-01-01 14:40:00"),
					dayjs("2000-01-01 14:56:30"),
					"second",
					"[]",
				)
			)

		case "open": // -- 早盘换仓
			return (
				// -- 卖出时间: 09:30:00-14:52:00
				sellTimeObj.isBetween(
					dayjs("2000-01-01 09:30:00"),
					dayjs("2000-01-01 14:52:00"),
					"second",
					"[]",
				) &&
				// -- 买入时间必须在卖出时间之后
				buyTimeObj.isAfter(sellTimeObj)
			)

		case "close": // -- 尾盘换仓
			return true // -- 时间自适应，选股后立即买入
	}

	return false
}
