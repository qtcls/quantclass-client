/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export type InitialValueType = Record<string, Array<{ times: string }>>

export interface StoreAPI {
	getStoreValue: (
		key: string,
		defaultValue?: unknown,
	) => Promise<
		string | InitialValueType | Record<string, any> | boolean | number
	>
	deleteStoreValue: (key: string) => Promise<void>
	setStoreValue: (key: string, value: any) => void
}
