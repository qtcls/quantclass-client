/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { RealMarketConfigType } from "@/renderer/types"
import { useAtom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { realMarketConfigAtom } from "../store/electron"
import { realMarketConfigSchemaAtom } from "../store/storage"

export function useRealMarketConfig() {
	const [realMarketConfig, setRealMarketConfig] = useAtom(realMarketConfigAtom)
	const setRealMarketConfigSchema = useSetAtom(realMarketConfigSchemaAtom)

	const updateRealMarketConfig = useCallback(
		(newRealMarketConfig: Partial<RealMarketConfigType>) => {
			setRealMarketConfig((prev: RealMarketConfigType) => ({
				...prev,
				...newRealMarketConfig,
			}))
			// TODO: 设置 realMarketConfigSchemaAtom，用于后续表单，临时处理
			setRealMarketConfigSchema((prev) => ({
				...prev,
				performance_mode: newRealMarketConfig.performance_mode,
			}))
		},
		[setRealMarketConfig, setRealMarketConfigSchema],
	)

	const performanceMode = realMarketConfig.performance_mode || "EQUAL"
	const setPerformanceMode = useCallback(
		(mode: string) =>
			updateRealMarketConfig({
				performance_mode: mode as "EQUAL" | "PERFORMANCE" | "ECONOMY",
			}),
		[updateRealMarketConfig],
	)

	return {
		realMarketConfig,
		setRealMarketConfig,
		updateRealMarketConfig,

		performanceMode,
		setPerformanceMode,
	}
}
