/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { REAL_MARKET_SS_SELECTED_STRATEGIES as REAL_MARKET_SELECT_STRATEGIES } from "@/renderer/constant"
import type {
	PosStrategyType,
	SelectStgType,
	StgGroupType,
} from "@/renderer/types/strategy"
import { genPosMgmtStrategyDict, genSelectStrategyDict } from "@/renderer/utils"

const { setStoreValue } = window.electronAPI

// -- 处理偏移列表，支持中英文逗号，去重和转换为数字
export const processOffsetList = (offsetListStr: string): number[] => {
	return Array.from(
		new Set(
			offsetListStr
				.replace(/，/g, ",")
				.split(",")
				.map((s) => s.trim().replace(/\s+/g, "")) // -- 处理空格
				.filter((s) => s !== "") // -- 过滤空字符串
				.map(Number), // -- 转换为数字
		),
	).sort((a, b) => a - b) // -- 排序
}

// -- 生成随机交易时间
// export const generateTradeTime = () => {
//     return {
//         buy_time: generateRandomTime(9, 24, 50),
//         sell_time: generateRandomTime(14, 45, 50),
//         split_order_amount: Math.floor(Math.random() * (12000 - 6000 + 1)) + 6000,
//     }
// }

const genSelectStgInfo = (strategy: SelectStgType, includeInfo = true) => {
	return {
		name: strategy.name,
		cap_weight: strategy.cap_weight,
		hold_period: strategy.hold_period,
		offset_list: strategy.offset_list,
		select_num: Number.parseInt(String(strategy.select_num)),
		factor_list: strategy.factor_list,
		filter_list: strategy.filter_list,
		rebalance_time: strategy.rebalance_time,
		timing: strategy.timing ?? null,
		...(includeInfo ? { info: strategy.info ?? {} } : {}), // -- 根据参数决定是否包含info字段
	}
}

export const saveStrategyList = async (strategies: SelectStgType[]) => {
	/**
	 * @description 保存策略列表
	 */
	// -- 调整权重，把百分比转换为小数
	const strategiesWithAdjustedWeight = strategies.map((strategy) => ({
		...strategy,
		cap_weight: strategy.cap_weight / 100,
		calc_time: strategy.calc_time ?? "08:00:00",
	}))
	// -- 生成策略配置字典，添加index
	const strategyDict = strategiesWithAdjustedWeight.reduce(
		(acc, item, index) => {
			acc[`#${index}.${item.name}`] = genSelectStrategyDict(
				item as SelectStgType,
			)
			return acc
		},
		{},
	)
	// -- 生成aqua内核策略列表
	const selectStrategyList = strategiesWithAdjustedWeight.map((stg) =>
		genSelectStgInfo(stg, false),
	)
	await setStoreValue(
		REAL_MARKET_SELECT_STRATEGIES,
		strategiesWithAdjustedWeight,
	)
	await setStoreValue("select_stock.strategy_list", selectStrategyList)
	return strategyDict
}

// 仓位管理生成dict
export const saveStrategyListFusion = async (
	fusionStrategies: (SelectStgType | StgGroupType | PosStrategyType)[],
) => {
	// 深度拷贝输入的策略，避免污染原始数据
	const strategies = JSON.parse(JSON.stringify(fusionStrategies))
	// -- 调整权重，把百分比转换为小数
	const strategiesWithAdjustedWeight = strategies.map(
		(strategy: SelectStgType | StgGroupType | PosStrategyType) => ({
			...strategy,
			cap_weight: (strategy.cap_weight ?? 100) / 100,
		}),
	)

	// -- 生成zeus内核策略列表
	const selectStrategyList = strategiesWithAdjustedWeight.map((stg) => {
		switch (stg.type) {
			case "pos":
				return {
					name: stg.name,
					hold_period: stg.hold_period,
					offset_list: stg.offset_list,
					max_select_num: stg.max_select_num ?? 0, // -- 最大选股数量
					rebalance_time: stg.rebalance_time,
					cap_weight: stg.cap_weight,
					params: stg.params,
					strategy_pool: stg.strategy_pool.map((grp_or_stg) =>
						grp_or_stg.type === "group"
							? {
									name: grp_or_stg.name,
									cap_weight: grp_or_stg.cap_weight,
									strategy_list: grp_or_stg.strategy_list.map((_stg) =>
										genSelectStgInfo(_stg as SelectStgType),
									),
								}
							: genSelectStgInfo(grp_or_stg as SelectStgType),
					),
				}
			case "group":
				return {
					name: stg.name,
					cap_weight: stg.cap_weight,
					strategy_list: stg.strategy_list.map((_stg) =>
						genSelectStgInfo(_stg as SelectStgType),
					),
				}
			default:
				return genSelectStgInfo(stg as SelectStgType)
		}
	})
	await setStoreValue("pos_mgmt.strategies", selectStrategyList)

	// -- 生成策略配置字典，添加index
	const strategyDict = strategiesWithAdjustedWeight.reduce(
		(
			acc: Record<string, any>,
			item: PosStrategyType | SelectStgType | StgGroupType,
			index: number,
		) => {
			const strategyName = `X${index + 1}-${item.name}`

			switch (item.type) {
				case "pos":
					acc[strategyName] = genPosMgmtStrategyDict(item as PosStrategyType)
					break
				case "group":
					if (item.strategy_list.length > 1) {
						// 处理策略组
						item.strategy_list.forEach((curr1, index1) => {
							const key = `${strategyName}#${index1}.${curr1.name}`
							acc[key] = genSelectStrategyDict({
								...curr1,
								cap_weight: (curr1.cap_weight / 100) * (item.cap_weight || 1),
							})
						})
					} else {
						acc[strategyName] = genSelectStrategyDict(item.strategy_list[0])
					}
					break
				default:
					acc[strategyName] = genSelectStrategyDict(item as SelectStgType)
					break
			}
			return acc
		},
		{},
	)
	return strategyDict
}
