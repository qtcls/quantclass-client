/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { atomEffect } from "jotai-effect"
import { atomWithQuery } from "jotai-tanstack-query"
import { versionAtom } from "./storage"

const { getCoreAndClientVersions: getCoreAndClientVersionWithLoop } =
	window.electronAPI

// -- 版本查询 atom
export const versionQueryAtom = atomWithQuery(() => ({
	queryKey: ["version"],
	queryFn: () => getCoreAndClientVersionWithLoop(),
}))

// -- 使用 atomEffect 处理版本更新
export const versionEffectAtom = atomEffect((get, set) => {
	// -- 监听 versionQueryAtom 的变化
	const { data, isSuccess } = get(versionQueryAtom)

	if (isSuccess && data) {
		// -- 更新版本信息
		set(versionAtom, data)
	}
})
