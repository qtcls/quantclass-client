/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useHandleTimeTask } from "@/renderer/hooks/useHandleTimeTask"
import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

export const useAuthUpdateButton = () => {
	const { pathname } = useLocation()
	const isDisabled = useRef(false)
	const handleTimeTask = useHandleTimeTask()

	useEffect(() => {
		if (pathname === "/setting") {
			isDisabled.current = true
			handleTimeTask(true)

			return
		}

		isDisabled.current = false
	}, [pathname])

	return isDisabled.current
}
