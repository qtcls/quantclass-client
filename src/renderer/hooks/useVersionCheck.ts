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
		const remoteVersion = appVersions?.app?.version
		if (!remoteVersion || !localVersions?.clientVersion) {
			return false
		}
		return remoteVersion !== localVersions.clientVersion
	}, [appVersions?.app?.version, localVersions?.clientVersion])

	// 检查是否有内核版本更新
	const hasKernalUpdates = useMemo(() => {
		const latestRemoteVersions = appVersions?.latest
		if (!latestRemoteVersions || !localVersions) {
			return {
				fuel: false,
				aqua: false,
				zeus: false,
				rocket: false,
			}
		}

		return {
			fuel: latestRemoteVersions?.fuel !== localVersions.fuelVersion,
			aqua:
				settings.libraryType === "select"
					? latestRemoteVersions?.aqua !== localVersions.aquaVersion
					: false,
			zeus:
				settings.libraryType === "pos"
					? latestRemoteVersions?.zeus !== localVersions.zeusVersion
					: false,
			rocket: latestRemoteVersions?.rocket !== localVersions.rocketVersion,
		}
	}, [appVersions?.latest, localVersions, settings.libraryType])

	// 检查是否有任何更新
	const hasAnyUpdate = useMemo(() => {
		return hasClientUpdate || Object.values(hasKernalUpdates).some(Boolean)
	}, [hasClientUpdate, hasKernalUpdates])

	// 生成更新消息
	const getUpdateMessage = useMemo(() => {
		if (!hasAnyUpdate) return ""

		const updates: string[] = []

		if (hasClientUpdate) {
			updates.push(
				`客户端: ${localVersions?.clientVersion} → ${appVersions?.app.version}`,
			)
		}

		if (hasKernalUpdates.fuel) {
			updates.push(
				`数据内核: ${localVersions?.fuelVersion} → ${appVersions?.latest?.fuel}`,
			)
		}

		if (hasKernalUpdates.aqua && settings.libraryType === "select") {
			updates.push(
				`选股内核: ${localVersions?.aquaVersion} → ${appVersions?.latest?.aqua}`,
			)
		}

		if (hasKernalUpdates.zeus && settings.libraryType === "pos") {
			updates.push(
				`高级选股内核: ${localVersions?.zeusVersion} → ${appVersions?.latest?.zeus}`,
			)
		}

		if (hasKernalUpdates.rocket) {
			updates.push(
				`下单内核: ${localVersions?.rocketVersion} → ${appVersions?.latest?.rocket}`,
			)
		}

		return updates.length > 0 ? updates.join("\n") : ""
	}, [
		hasAnyUpdate,
		hasClientUpdate,
		hasKernalUpdates,
		localVersions,
		appVersions,
		settings.libraryType,
	])

	return {
		hasClientUpdate,
		hasKernalUpdates,
		hasAnyUpdate,
		isCheckingVersions: isCheckingAppVersions,
		appVersions,
		localVersions,
		getUpdateMessage,
	}
}
