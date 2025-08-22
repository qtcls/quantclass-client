/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { selectStgListAtom, totalWeightAtom } from "@/renderer/store/storage"
import { useUpdateEffect } from "etc-hooks"
import { useAtomValue, useSetAtom } from "jotai"

export const useCalcTotalWeight = () => {
	const setTotalWeight = useSetAtom(totalWeightAtom)
	const selectStgList = useAtomValue(selectStgListAtom)

	useUpdateEffect(() => {
		const totalWeight = selectStgList.reduce(
			(acc, curr) => acc + curr.cap_weight,
			0,
		)
		setTotalWeight(totalWeight)
	}, [selectStgList])
}
