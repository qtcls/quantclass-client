/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { IDataListType } from "@/renderer/schemas/data-schema"
import { useCallback, useRef } from "react"

export interface StepsTourModalRef {
	open: (item: IDataListType) => void
}

export const useStepsTourModal = () => {
	const stepsTourModalRef = useRef<StepsTourModalRef>(null)

	const openStepsTourModal = useCallback((item: IDataListType) => {
		stepsTourModalRef.current?.open(item)
	}, [])

	return {
		stepsTourModalRef,
		openStepsTourModal,
	}
}
