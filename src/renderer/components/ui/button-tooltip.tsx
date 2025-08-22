/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/renderer/components/ui/tooltip"
import { ReactNode } from "react"

const ButtonTooltip = ({
	content,
	sideOffset = 8,
	children,
	delayDuration = 200,
}: {
	content: string | ReactNode
	sideOffset?: number
	children: ReactNode
	delayDuration?: number
}) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={delayDuration}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>

				<TooltipContent sideOffset={sideOffset}>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default ButtonTooltip
