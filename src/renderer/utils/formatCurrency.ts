/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export function formatCurrency(amount: number): string {
	// -- 定义单位数组
	const units = ["", "万", "亿", "万亿"]

	// -- 如果金额为 0，直接返回 "0.00"
	if (amount === 0) return "0.00"

	// -- 取绝对值
	const absAmount = Math.abs(amount)

	// -- 如果绝对值小于 1，直接格式化小数
	if (absAmount < 1) {
		const formattedValue = absAmount.toFixed(2).replace(/\.00$/, "")
		return amount < 0 ? `-${formattedValue}` : formattedValue
	}

	// -- 计算单位级别
	const unitLevel = Math.floor(Math.log10(absAmount) / 4)

	// -- 计算显示的数值
	const displayValue = (absAmount / 10000 ** unitLevel).toFixed(2)

	// -- 移除末尾的 ".00"（如果存在）
	const formattedValue = displayValue.replace(/\.00$/, "")

	// -- 组合结果
	const result = `${formattedValue} ${units[unitLevel] || ""}`

	// -- 如果原始数值为负，添加负号
	return amount < 0 ? `-${result}` : result
}
