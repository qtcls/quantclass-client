/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useReducer } from "react"

export function useToggle<T = boolean>(
	options: readonly T[] = [false, true] as any,
) {
	const [[option], toggle] = useReducer(
		(state: T[], action: React.SetStateAction<T>) => {
			const value = action instanceof Function ? action(state[0]) : action
			const index = Math.abs(state.indexOf(value))

			return state.slice(index).concat(state.slice(0, index))
		},
		options as T[],
	)

	return [option, toggle as (value?: React.SetStateAction<T>) => void] as const
}
