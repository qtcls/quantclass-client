/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { isAutoRocketAtom, isUpdatingAtom } from "@/renderer/store"
import {
	fusionAtom,
	libraryTypeAtom,
	selectStgListAtom,
} from "@/renderer/store/storage"
import type {
	PosStrategyType,
	SelectStgType,
	StgGroupType,
} from "@/renderer/types/strategy"
import dayjs from "dayjs"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"

export const useToggleAutoRealTrading = () => {
	const isUpdating = useAtomValue(isUpdatingAtom) // -- 获取内核是否自动更新
	const [isAutoRocket, setIsAutoRocket] = useAtom(isAutoRocketAtom) // -- 获取是否自动实盘
	const selectStgList = useAtomValue(selectStgListAtom) // -- 获取选择的策略
	const libraryType = useAtomValue(libraryTypeAtom)
	const fusion = useAtomValue(fusionAtom)

	const { setAutoTrading, getStoreValue, setStoreValue, killRocket } =
		window.electronAPI

	const strategies = useMemo(() => {
		return libraryType === "pos" ? fusion : selectStgList
	}, [libraryType, selectStgList, fusion])

	/**
	 * @description 启动自动实盘
	 */
	const handleToggleAutoRocket = useCallback(
		async (enable: boolean, showToast = true, ignoreUpdateCheck = false) => {
			if (enable) {
				if (!ignoreUpdateCheck && !isUpdating) {
					showToast && toast.warning("请在首页，先启动自动更新数据")
					return
				}

				if (
					strategies.map(
						(item: SelectStgType | StgGroupType | PosStrategyType) =>
							(item.cap_weight ?? 1) > 0,
					).length === 0
				) {
					showToast &&
						toast.warning(
							strategies.length > 0
								? "所有策略权重为 0，请先分配权重"
								: "请先导入策略，再分配权重",
						)
					return
				}

				const realMarketConfig = (await getStoreValue(
					"real_market_config",
				)) as Record<string, any>

				if (
					![
						"qmt_path",
						"qmt_port",
						"account_id",
						"filter_cyb",
						"filter_kcb",
						"filter_bj",
					].every((k) => Object.keys(realMarketConfig).includes(k))
				) {
					showToast && toast.warning("请在实盘配置中完善 QMT 配置")
					return
				}
			}

			const needToast = showToast && enable !== isAutoRocket // 是否需要toast, 如果状态相同，则不toast
			setAutoTrading(enable) // 调用IPC
			setIsAutoRocket(enable) // 设置atom状态
			setStoreValue(
				"last_heartbeat_time",
				enable ? dayjs().format("HH:mm") : null,
			)
			!enable && (await killRocket())

			if (needToast) {
				toast.success(
					enable && ignoreUpdateCheck
						? "自动更新数据和自动实盘已开启"
						: enable
							? "自动实盘已开启"
							: "已关闭自动实盘且终止相关进程",
				)
			}

			return true
		},
		[isUpdating],
	)

	return {
		isAutoRocket,
		handleToggleAutoRocket,
	}
}
