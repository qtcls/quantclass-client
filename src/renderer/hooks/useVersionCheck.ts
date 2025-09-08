/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useAppVersions } from "@/renderer/hooks/useAppVersion"
import { versionsAtom } from "@/renderer/store/versions"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { useSettings } from "./useSettings"

/**
 * 检查版本是否有更新的hook
 * @returns 版本检查结果和相关状态
 */
export const useVersionCheck = () => {
	const { appVersions, isCheckingAppVersions } = useAppVersions()
	const { settings } = useSettings()
	const localVersions = useAtomValue(versionsAtom)

	// 检查是否有客户端版本更新
	const hasClientUpdate = useMemo(() => {
		if (!appVersions?.app.version || !localVersions?.clientVersion) {
			return false
		}
		return appVersions.app.version !== localVersions.clientVersion
	}, [appVersions?.app.version, localVersions?.clientVersion])

	// 检查是否有内核版本更新
	const hasCoreUpdates = useMemo(() => {
		if (!appVersions?.latest || !localVersions) {
			return {
				fuel: false,
				aqua: false,
				zeus: false,
				rocket: false,
			}
		}

		return {
			fuel: appVersions.latest.fuel !== localVersions.coreVersion,
			aqua:
				settings.libraryType === "select"
					? appVersions.latest.aqua !== localVersions.aquaVersion
					: false,
			zeus:
				settings.libraryType === "pos"
					? appVersions.latest.zeus !== localVersions.zeusVersion
					: false,
			rocket: appVersions.latest.rocket !== localVersions.rocketVersion,
		}
	}, [appVersions?.latest, localVersions, settings.libraryType])

	// 检查是否有任何更新
	const hasAnyUpdate = useMemo(() => {
		return hasClientUpdate || Object.values(hasCoreUpdates).some(Boolean)
	}, [hasClientUpdate, hasCoreUpdates])

	// 生成更新消息
	const getUpdateMessage = useMemo(() => {
		if (!hasAnyUpdate) return ""

		const updates: string[] = []

		if (hasClientUpdate) {
			updates.push(
				`客户端: ${localVersions?.clientVersion} → ${appVersions?.app.version}`,
			)
		}

		if (hasCoreUpdates.fuel) {
			updates.push(
				`数据内核: ${localVersions?.coreVersion} → ${appVersions?.latest?.fuel}`,
			)
		}

		if (hasCoreUpdates.aqua && settings.libraryType === "select") {
			updates.push(
				`选股内核: ${localVersions?.aquaVersion} → ${appVersions?.latest?.aqua}`,
			)
		}

		if (hasCoreUpdates.zeus && settings.libraryType === "pos") {
			updates.push(
				`高级选股内核: ${localVersions?.zeusVersion} → ${appVersions?.latest?.zeus}`,
			)
		}

		if (hasCoreUpdates.rocket) {
			updates.push(
				`下单内核: ${localVersions?.rocketVersion} → ${appVersions?.latest?.rocket}`,
			)
		}

		return updates.length > 0 ? updates.join("\n") : ""
	}, [
		hasAnyUpdate,
		hasClientUpdate,
		hasCoreUpdates,
		localVersions,
		appVersions,
		settings.libraryType,
	])

	return {
		hasClientUpdate,
		hasCoreUpdates,
		hasAnyUpdate,
		isCheckingVersions: isCheckingAppVersions,
		appVersions,
		localVersions,
		getUpdateMessage,
	}
}
