/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { cn } from "@/renderer/lib/utils"

const UnMaximize = ({ className }: { className?: string }) => {
	return (
		<svg
			className={cn("h-6 w-6", className)}
			viewBox="0 0 1024 1024"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			p-id="2718"
			width="64"
			height="64"
		>
			<path
				d="M855.466667 168.533333h-554.666667V277.333333H192v554.666667h554.666667v-108.8h108.8v-554.666667zM704 789.333333H234.666667V320h469.333333v469.333333z m108.8-108.8H746.666667V277.333333H343.466667V211.2h469.333333v469.333333z"
				p-id="2719"
			></path>
		</svg>
	)
}

export default UnMaximize
