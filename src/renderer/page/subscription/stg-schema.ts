/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { z } from "zod"

export const StrategyListSchema = z.object({
	key: z.string().optional(),
	buy_time: z.string().optional(),
	code: z.number().optional(),
	displayName: z.string().optional(),
	name: z.string().optional(),
	period: z.string().optional(),
	select_time: z.string().optional(),
	select_num: z.string().optional(),
	info: z
		.object({
			name: z.string(),
			displayName: z.string(),
			selected_strategy: z.string().optional(),
		})
		.optional(),
	result: z
		.array(
			z.object({
				name: z.string().optional(),
				symbol: z.string().optional(),
			}),
		)
		.optional(),
})

export type IStrategyList = z.infer<typeof StrategyListSchema>
