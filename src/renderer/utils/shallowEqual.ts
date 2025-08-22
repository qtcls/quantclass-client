/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export function shallowEqual(a: any, b: any) {
	if (a === b) {
		return true
	}

	if (!(a instanceof Object) || !(b instanceof Object)) {
		return false
	}

	const keys = Object.keys(a)
	const { length } = keys

	if (length !== Object.keys(b).length) {
		return false
	}

	for (let i = 0; i < length; i += 1) {
		const key = keys[i]

		if (!(key in b)) {
			return false
		}

		if (a[key] !== b[key]) {
			return false
		}
	}

	return true
}
