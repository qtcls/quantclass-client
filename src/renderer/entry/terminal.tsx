/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { ThemesProvider } from "@/renderer/components/providers"
import { ThemeWrapper } from "@/renderer/components/theme-wrapper"
import Log from "@/renderer/entry/Log"
import ReactDOM from "react-dom/client"
import "../global.css"
import "../themes.css"

const root = ReactDOM.createRoot(document.getElementById("app")!)
root.render(
	<ThemesProvider
		attribute="class"
		defaultTheme="system"
		enableSystem
		storageKey="ui-theme"
		disableTransitionOnChange
	>
		<ThemeWrapper>
			<Log />
		</ThemeWrapper>
	</ThemesProvider>,
)
