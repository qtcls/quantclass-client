/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

// import { z } from "zod"
// import { compareTimeValues, isTimeInRange } from "@/renderer/utils"
// import { parseRebalanceTime } from "@/renderer/utils/trade"
// import type { TimeValue } from "react-aria"

// ===== 通用验证函数 =====

// export function createTimeRangeValidator<
//     T extends {
//         calc_time?: TimeValue | null
//         rebalance_time?: string
//     },
// >(errorMessages: {
//     closeTrading: string
//     nonCloseTrading: string
// }) {
//     return z.object({}).refine(
//         (data: T) => {
//             const { buy_point } = parseRebalanceTime(
//                 data.rebalance_time ?? "close-open",
//             )
//             if (buy_point === "close") {
//                 return (
//                     data.calc_time != null &&
//                     isTimeInRange(data.calc_time, "14:25:00", "14:50:00")
//                 )
//             }
//             return (
//                 data.calc_time == null ||
//                 !isTimeInRange(data.calc_time, "14:25:00", "14:50:00")
//             )
//         },
//         (data: T) => ({
//             message:
//                 data.rebalance_time !== "close"
//                     ? errorMessages.nonCloseTrading
//                     : errorMessages.closeTrading,
//             path: ["calc_time"],
//         }),
//     )
// }

// export function createBuySellTimeValidator<
//     T extends {
//         buy_time?: TimeValue | string
//         sell_time?: TimeValue | string
//         rebalance_time?: string
//     },
// >(errorMessages: {
//     buyBeforeSell: string
//     buyAfterSell: string
// }) {
//     return z.object({}).refine(
//         (data: T) => {
//             const rebalance_time = data.rebalance_time ?? "close-open"
//             if (rebalance_time !== "close-open" && data.buy_time && data.sell_time) {
//                 return compareTimeValues(data.buy_time, data.sell_time) > 0
//             }
//             if (rebalance_time === "close-open" && data.buy_time && data.sell_time) {
//                 return compareTimeValues(data.buy_time, data.sell_time) < 0
//             }
//             return true
//         },
//         (data: T) => {
//             const rebalance_time = data.rebalance_time ?? "close-open"
//             return {
//                 message:
//                     rebalance_time === "close-open"
//                         ? errorMessages.buyBeforeSell
//                         : errorMessages.buyAfterSell,
//                 path: ["buy_time"],
//             }
//         },
//     )
// }

// ===== 数据转换工具 =====

export function transformOffsetListFromString(offsetStr: string): number[] {
	return offsetStr
		.split(",")
		.map((s) => Number(s.trim()))
		.filter((n) => !Number.isNaN(n))
}

export function transformOffsetListToString(offsetList: number[]): string {
	return offsetList.join(",")
}

export function transformSelectNumFromString(
	selectStr: string | number,
): number {
	return typeof selectStr === "string" ? Number(selectStr) : selectStr
}

export function transformSplitOrderAmountFromString(
	amount: string | number,
): number {
	return typeof amount === "string" ? Number(amount) : amount
}

// ===== 通用错误消息 =====

export const COMMON_ERROR_MESSAGES = {
	TIME_VALIDATION: {
		closeTrading: "尾盘换仓时必须选择交易时间内的计算时间",
		nonCloseTrading: "非尾盘换仓不能在交易时间计算",
		buyBeforeSell: "买入时间必须在卖出时间之前",
		buyAfterSell: "买入时间必须在卖出时间之后",
	},
	REQUIRED_FIELDS: {
		name: "请输入策略名称",
		holdPeriod: "请选择持仓周期",
		selectNum: "请输入选股数量",
		offsetList: "请输入偏移列表",
	},
} as const
