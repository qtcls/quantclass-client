/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { shallowEqual } from "@/renderer/utils/shallowEqual"
import { useEffect, useRef } from "react"

function shallowCompare(
	prevValue?: React.DependencyList | null,
	currValue?: React.DependencyList,
) {
	if (!prevValue || !currValue) {
		return false
	}

	if (prevValue === currValue) {
		return true
	}

	if (prevValue.length !== currValue.length) {
		return false
	}

	for (let i = 0; i < prevValue.length; i += 1) {
		if (!shallowEqual(prevValue[i], currValue[i])) {
			return false
		}
	}

	return true
}

function useShallowCompare(dependencies?: React.DependencyList) {
	const ref = useRef<React.DependencyList | null | undefined>([])
	const updateRef = useRef<number>(0)

	if (!shallowCompare(ref.current, dependencies)) {
		ref.current = dependencies
		updateRef.current += 1
	}

	return [updateRef.current]
}

export function useShallowEffect(
	cb: () => void,
	dependencies?: React.DependencyList,
): void {
	useEffect(cb, useShallowCompare(dependencies))
}
