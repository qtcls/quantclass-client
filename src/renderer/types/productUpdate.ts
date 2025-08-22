/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export interface ProductUpdateAPI {
	handleUpdateOneProduct: (
		product?: string,
	) => Promise<{ status: string; message: string }>
	handleUpdateFullProducts: (
		product_name: string,
		full_data_name?: string,
	) => Promise<{ status: string; message: string }>
	handleUpdateStrategies: (strategy?: string) => Promise<void>
}
