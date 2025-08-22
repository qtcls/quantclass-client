/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { SelectStgFormData } from "@/renderer/page/strategy/types"
import { autoTradeTimeByRebTime } from "@/renderer/utils/trade"
import { isNumber } from "lodash-es"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

export const useFormValidation = (form: UseFormReturn<SelectStgFormData>) => {
	// -- 验证表单数据并返回验证结果
	const validateFormData = async (data: SelectStgFormData) => {
		/**
		 * 拆单金额必须为大于 0 的数字
		 */
		const splitOrderAmount = Number(data.split_order_amount)

		if (!isNumber(splitOrderAmount) || splitOrderAmount <= 0) {
			toast.error("拆单金额必须为大于 0 的数字")
			return false
		}

		/**
		 * 交易时间验证
		 */
		let sellTime = data.sell_time // -- 表单中的卖出时间
		let buyTime = data.buy_time // -- 表单中的买入时间

		const { sell_time, buy_time } = autoTradeTimeByRebTime(
			data.rebalance_time ?? "close-open",
		) // -- 生成自动交易时间

		// -- 如果表单中没有时间，使用自动生成的时间
		if (!sellTime || !buyTime) {
			sellTime = sell_time
			buyTime = buy_time
		}

		form.setValue("sell_time", sellTime)
		form.setValue("buy_time", buyTime)
		return true
	}

	return {
		validateFormData,
	}
}
