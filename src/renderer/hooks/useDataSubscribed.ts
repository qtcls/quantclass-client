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
import { dataSubscribedAtom } from "@/renderer/store/electron"
import { dataApiProductsAtom } from "@/renderer/store/query"
import { useAtom } from "jotai"
import { compact } from "lodash-es"
import { useCallback, useMemo } from "react"
import { useSettings } from "./useSettings"

export function useDataSubscribed() {
	const [dataSubscribed, setDataSubscribed] = useAtom(dataSubscribedAtom)
	const [{ data: dataApi }] = useAtom(dataApiProductsAtom)
	const { updateSettings } = useSettings()

	const isSubscribed = useCallback(
		(data: IDataListType | string) => {
			const name = typeof data === "string" ? data : data.name
			return dataSubscribed.some((item) => item.name === name)
		},
		[dataSubscribed],
	)

	const setDataSubscribedNameList = useCallback(
		(selection: Record<string, boolean>) => {
			const selectedNames = Object.keys(selection).filter(
				(key) => selection[key] === true,
			)
			const data = compact(
				dataApi?.data.map((item) =>
					selectedNames.includes(item.key)
						? {
								name: item.key,
								displayName: item.description,
								fullData: item.fullData,
								isAutoUpdate: 1,
							}
						: undefined,
				),
			)
			setDataSubscribed(data as IDataListType[])
			updateSettings({ data_white_list: selectedNames })
		},
		[dataApi],
	)

	const removeDataSubscribed = useCallback(
		(data: IDataListType) => {
			setDataSubscribed((prev) => {
				const next = prev.filter((item) => item.name !== data.name)
				updateSettings({ data_white_list: next.map((item) => item.name) })
				return next
			})
		},
		[setDataSubscribed],
	)

	const resetDataSubscribed = useCallback(() => {
		setDataSubscribed([])
		updateSettings({ data_white_list: [] })
	}, [setDataSubscribed, updateSettings])

	const dataSubscribedNameList = useMemo(() => {
		return dataSubscribed.map((item) => item.name)
	}, [dataSubscribed])

	return {
		dataSubscribed,
		dataSubscribedNameList,
		setDataSubscribedNameList,
		setDataSubscribed,
		removeDataSubscribed,
		resetDataSubscribed,
		isSubscribed,
	}
}
