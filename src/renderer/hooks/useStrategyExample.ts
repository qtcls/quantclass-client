/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useStrategy } from "@/renderer/context/store-context"
import type { SelectStgType } from "@/renderer/types/strategy"

/**
 * 示例：如何在组件中使用 Strategy Provider
 *
 * 这个 Provider 提供了以下功能：
 * 1. 自动监听 atom 变化
 * 2. 自动与 IPC 联动保存数据
 * 3. 提供统一的策略管理接口
 */

export function useStrategyExample() {
	const {
		// 状态
		fusion,
		selectStgList,
		libraryType,

		// Fusion 操作方法
		updateFusion,
		addFusionStrategies,
		removeFusionStrategy,
		updateFusionStgInRow,
		resetFusion,
		syncFusion,

		// SelectStgList 操作方法
		updateSelectStgList,
		addSelectStgList,
		removeSelectStg,
		updateSelectStg,
		resetSelectStgList,
		syncSelectStgList,
	} = useStrategy()

	// 示例：添加选股策略
	const handleAddSelectStrategy = (strategy: SelectStgType) => {
		addSelectStgList([strategy])
		// 数据会自动保存到 IPC，无需手动调用 syncSelectStgList
	}

	// 示例：删除 Fusion 策略
	const handleRemoveFusionStrategy = (index: number) => {
		removeFusionStrategy(index)
		// 数据会自动保存到 IPC，无需手动调用 syncFusion
	}

	// 示例：更新 Fusion 策略中的单个策略
	const handleUpdateFusionStrategy = (
		fusionIndex: number,
		values: any,
		strategy: SelectStgType,
		rowIndex: number,
	) => {
		updateFusionStgInRow(fusionIndex, values, strategy, rowIndex)
		// 数据会自动保存到 IPC
	}

	// 示例：重置所有策略
	const handleResetAll = () => {
		if (libraryType === "pos") {
			resetFusion()
		} else {
			resetSelectStgList()
		}
	}

	return {
		// 状态
		fusion,
		selectStgList,
		libraryType,

		// 操作方法
		handleAddSelectStrategy,
		handleRemoveFusionStrategy,
		handleUpdateFusionStrategy,
		handleResetAll,

		// 原始方法（如果需要）
		updateFusion,
		addFusionStrategies,
		removeFusionStrategy,
		updateFusionStgInRow,
		resetFusion,
		syncFusion,
		updateSelectStgList,
		addSelectStgList,
		removeSelectStg,
		updateSelectStg,
		resetSelectStgList,
		syncSelectStgList,
	}
}

/**
 * 使用示例：
 *
 * function MyComponent() {
 *   const {
 *     fusion,
 *     selectStgList,
 *     libraryType,
 *     handleAddSelectStrategy,
 *     handleRemoveFusionStrategy,
 *     handleResetAll
 *   } = useStrategyExample()
 *
 *   return (
 *     <div>
 *       <p>当前库类型: {libraryType}</p>
 *       <p>Fusion 策略数量: {fusion.length}</p>
 *       <p>选股策略数量: {selectStgList.length}</p>
 *
 *       <button onClick={() => handleAddSelectStrategy(newStrategy)}>
 *         添加选股策略
 *       </button>
 *
 *       <button onClick={() => handleRemoveFusionStrategy(0)}>
 *         删除第一个 Fusion 策略
 *       </button>
 *
 *       <button onClick={handleResetAll}>
 *         重置所有策略
 *       </button>
 *     </div>
 *   )
 * }
 */
