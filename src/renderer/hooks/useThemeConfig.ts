/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { THEMES, type Theme } from "@renderer/lib/themes"

type ThemesConfig = {
	activeTheme: Theme
}

const configAtom = atomWithStorage<ThemesConfig>("themes:config", {
	activeTheme: THEMES[0],
})

export function useThemesConfig() {
	const [themesConfig, setThemesConfig] = useAtom(configAtom)

	return { themesConfig, setThemesConfig }
}
