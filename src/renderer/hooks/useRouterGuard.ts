/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { accountKeyAtom } from "@/renderer/store/storage"
import { useUpdateEffect } from "etc-hooks"
import { useAtomValue } from "jotai"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { activeTabAtom } from "../store"
import { useSettings } from "./useSettings"

export const useRouterGuard = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { uuid = "", apiKey = "" } = useAtomValue(accountKeyAtom)
	const activeTab = useAtomValue(activeTabAtom)
	const { settings } = useSettings()

	useUpdateEffect(() => {
		const checkSettings = async () => {
			if (!settings.all_data_path) {
				navigate("/")
				toast.warning("请先设置数据路径")
			}
		}

		checkSettings()
	}, [pathname, activeTab, uuid, apiKey])
}
