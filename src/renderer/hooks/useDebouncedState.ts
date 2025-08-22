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
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

export function useDebouncedState<T = any>(
	defaultValue: T,
	wait: number,
	options = { leading: false },
) {
	const [value, setValue] = useState(defaultValue)
	const timeoutRef = useRef<number | null>(null)
	const leadingRef = useRef(true)

	const clearTimeout = () => window.clearTimeout(timeoutRef.current!)
	useEffect(() => clearTimeout, [])

	const debouncedSetValue = useCallback(
		(newValue: SetStateAction<T>) => {
			clearTimeout()
			if (leadingRef.current && options.leading) {
				setValue(newValue)
			} else {
				timeoutRef.current = window.setTimeout(() => {
					leadingRef.current = true
					setValue(newValue)
				}, wait)
			}
			leadingRef.current = false
		},
		[options.leading],
	)

	return [value, debouncedSetValue] as const
}
