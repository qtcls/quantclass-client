/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { ThemeWrapper } from "@/renderer/components/theme-wrapper"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import React from "react"

interface SettingsLayoutProps {
	hideSidebar?: boolean
	sidebar: React.ReactNode
	children: React.ReactNode
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
	hideSidebar = false,
	sidebar,
	children,
}) => {
	return (
		<ThemeWrapper className="max-w-4xl flex flex-row p-0 gap-0 rounded-lg overflow-hidden">
			{!hideSidebar && (
				<div className="w-64 bg-primary/10">
					<ScrollArea className="h-full p-4">{sidebar}</ScrollArea>
				</div>
			)}

			<ScrollArea className="flex-1">
				<div className="py-3 px-4">{children}</div>
			</ScrollArea>
		</ThemeWrapper>
	)
}

export default SettingsLayout
