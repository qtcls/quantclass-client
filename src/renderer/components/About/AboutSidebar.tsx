/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { Button } from "@/renderer/components/ui/button"
import { Separator } from "@/renderer/components/ui/separator"
import { InfoIcon, Palette } from "lucide-react"
import React from "react"

interface SettingsSidebarProps {
	activeItem: string
	onItemClick: (item: string) => void
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
	activeItem,
	onItemClick,
}) => {
	const menuItems = [
		{ key: "common", title: "外观", icon: Palette },
		{ key: "about", title: "关于", icon: InfoIcon },
	]

	return (
		<nav className="space-y-2 px-1">
			<h2 className="text-xl font-semibold mb-2 ml-3">设置</h2>

			<Separator />

			{menuItems.map((item) => (
				<Button
					key={item.key}
					variant="linkHover2"
					className={`w-full justify-start text-muted-foreground ${
						activeItem === item.key
							? "bg-primary/10 dark:bg-primary/20"
							: "hover:bg-primary/10"
					}`}
					onClick={() => onItemClick(item.key)}
				>
					<item.icon className="w-4 h-4 mr-2" />
					{item.title}
				</Button>
			))}
		</nav>
	)
}

export default SettingsSidebar
