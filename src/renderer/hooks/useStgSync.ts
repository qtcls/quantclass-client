/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	fusionAtom,
	libraryTypeAtom,
	selectStgDictAtom,
	selectStgListAtom,
	// stgSelectionAtom,
} from "@/renderer/store/storage"
import type {
	PosStrategyType,
	SelectStgType,
	StgGroupType,
} from "@/renderer/types/strategy"
import {
	saveStrategyList,
	saveStrategyListFusion,
} from "@/renderer/utils/strategy"
// import { userAtom } from "@/renderer/store/user"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useCallback } from "react"

export function useStgSync() {
	// const { user } = useAtomValue(userAtom)
	// const { membershipInfo = [], isMember = false } = user ?? {}
	const [selectStgList, setSelectStgList] = useAtom(selectStgListAtom)
	// const setStgSelection = useSetAtom(stgSelectionAtom)
	const setSelectStgDict = useSetAtom(selectStgDictAtom)
	const [fusion, setFusion] = useAtom(fusionAtom)
	const libraryType = useAtomValue(libraryTypeAtom)
	const syncStrategies = async () => {
		// console.log(selectStgList)
		// -- 处理选股策略

		return updateStrategies(selectStgList)
	}

	const updateStrategies = useCallback(
		async (strategies: SelectStgType[]) => {
			setSelectStgList(strategies)
			if (libraryType !== "pos") {
				const selectStgDict = await saveStrategyList(strategies)
				setSelectStgDict(selectStgDict)
			}
			return strategies
		},
		[selectStgList, libraryType, []],
	)

	const updatePos = useCallback(
		async (strategies: (SelectStgType | StgGroupType | PosStrategyType)[]) => {
			setFusion(strategies)
			if (libraryType === "pos") {
				const selectStgDict = await saveStrategyListFusion(strategies)
				setSelectStgDict(selectStgDict)
			}
			return strategies
		},
		[fusion, libraryType, []],
	)

	const addPos = useCallback(
		async (strategies: (SelectStgType | StgGroupType | PosStrategyType)[]) => {
			setFusion([...fusion, ...strategies])
			if (libraryType === "pos") {
				const selectStgDict = await saveStrategyListFusion(strategies)
				setSelectStgDict(selectStgDict)
			}
			return strategies
		},
		[fusion, libraryType, []],
	)
	return { syncStrategies, updateStrategies, updatePos, addPos }
}
