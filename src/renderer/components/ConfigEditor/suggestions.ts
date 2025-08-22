/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import * as monaco from "monaco-editor"

export const createSuggestions = (
	range: monaco.languages.CompletionItem["range"],
) => [
	{
		label: "name",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"策略名称",
				"```json",
				'"name": "策略1"',
				"```",
				"- 类型：字符串",
				"- 必填：是",
				"- 说明：用于标识策略的唯一名称",
			].join("\n"),
		},
		insertText: '"name": "策略1"',
		range,
	},
	{
		label: "hold_period",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"持仓周期",
				"```json",
				'"hold_period": "3D"',
				"```",
				"- 类型：字符串",
				"- 必填：是",
				"- 格式：数字 + 单位",
				"- 支持单位：",
				"  - D：天（如：3D、5D、10D）",
				"  - W：周（如：1W、2W）",
				"  - M：月（如：1M、2M）",
			].join("\n"),
		},
		insertText: '"hold_period": "3D"',
		range,
	},
	{
		label: "offset_list",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"偏移列表",
				"```json",
				'"offset_list": [0]',
				"```",
				"- 类型：数组",
				"- 必填：是",
				"- 说明：偏移天数列表",
			].join("\n"),
		},
		insertText: '"offset_list": [0]',
		range,
	},
	{
		label: "select_num",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"选股数量",
				"```json",
				'"select_num": 10',
				"```",
				"- 类型：数字",
				"- 必填：是",
				"- 说明：",
				"  - 整数：表示具体选股数量（如：10）",
				"  - 小数：表示选股比例（如：0.1 表示选取 10% 的股票）",
			].join("\n"),
		},
		insertText: '"select_num": 10',
		range,
	},
	{
		label: "cap_weight",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"市值权重",
				"```json",
				'"cap_weight": 1',
				"```",
				"- 类型：数字",
				"- 必填：是",
				"- 说明：市值权重系数",
			].join("\n"),
		},
		insertText: '"cap_weight": 1',
		range,
	},
	{
		label: "factor_list",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"### 选股因子列表说明",
				"格式：`[因子名称, 排序方式, 参数, 权重]`\n",
				"- **因子名称**：需与因子库中的名称一致\n",
				"- **排序方式**：`true` 为升序，`false` 为降序\n",
				"- **参数**：因子计算参数，可以是数字、元组或 `null`\n",
				"- **权重**：因子在综合计算中的权重\n",
				"\n示例：",
				"```json",
				'"factor_list": [',
				'    ["成交额缩量因子", true, [10, 60], 1],  // 成交额缩量因子，升序排列，参数为 [10, 60]，权重为 1',
				'    ["Ret", true, 5, 1],                    // 收益率因子，升序排列，参数为 5，权重为 1',
				'    ["收盘价", true, null, 1],              // 收盘价因子，升序排列，无参数，权重为 1',
				'    ["换手率", true, 5, 1],                 // 换手率因子，升序排列，参数为 5，权重为 1',
				"]",
				"```",
			].join("\n"),
		},
		insertText: '"factor_list": []',
		range,
	},
	{
		label: "filter_list",
		kind: monaco.languages.CompletionItemKind.Property,
		documentation: {
			value: [
				"### 过滤因子列表说明",
				"格式：`[因子名称, 参数, 过滤条件]`\n",
				"- **因子名称**：需与因子库中的名称一致\n",
				"- **参数**：因子计算参数，可以是数字、列表或 `null`\n",
				"- **过滤条件**：支持以下格式：\n",
				"  - `val:==1`：等于 1\n",
				"  - `val:!=1`：不等于 1\n",
				"  - `pct:<=0.8`：小于等于 80 分位数\n",
				"\n示例：",
				"```json",
				'"filter_list": [',
				'    ["月份", [2], "val:==1"],              // 只在 2 月份选股',
				'    ["市值", null, "pct:<=0.8"],           // 市值小于等于 80 分位数',
				'    ["月份", [4], "val:!=1"],              // 不在 4 月份选股',
				'    ["Ret", 5, "pct:<=0.1"],               // 5 日收益率小于等于 10 分位数',
				'    ["收盘价", null, "pct:<=0.5"],         // 收盘价小于等于 50 分位数',
				'    ["换手率", 1, "pct:<=0.8"],            // 1 日换手率小于等于 80 分位数',
				'    ["成交额缩量因子", [10, 60], "pct:<=0.6"]  // 成交额缩量因子小于等于 60 分位数',
				"]",
				"```",
			].join("\n"),
		},
		insertText: '"filter_list": []',
		range,
	},
]
