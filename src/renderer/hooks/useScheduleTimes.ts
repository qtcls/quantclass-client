/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { scheduleTimesAtom } from "@/renderer/store/electron"
import { useAtom } from "jotai"
import { useCallback } from "react"

export function useScheduleTimes() {
	const [scheduleTimes, setScheduleTimes] = useAtom(scheduleTimesAtom)

	const updateScheduleTimes = useCallback(
		(newScheduleTimes: Partial<typeof scheduleTimes>) => {
			setScheduleTimes((prev) => ({ ...prev, ...newScheduleTimes }))
		},
		[setScheduleTimes],
	)

	const dataScheduleTimes = scheduleTimes.dataModule
	const setDataScheduleTimes = useCallback(
		(times: string[]) => updateScheduleTimes({ dataModule: times }),
		[updateScheduleTimes],
	)

	const selectScheduleTimes = scheduleTimes.selectModule
	const setSelectScheduleTimes = useCallback(
		(times: string[]) => updateScheduleTimes({ selectModule: times }),
		[updateScheduleTimes],
	)

	return {
		scheduleTimes,
		dataScheduleTimes,
		selectScheduleTimes,
		setDataScheduleTimes,
		setSelectScheduleTimes,
	}
}
