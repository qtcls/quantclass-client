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
import * as ProcessMonitorPrimitive from "@radix-ui/react-hover-card"
import * as React from "react"

const ProcessHoverCard = ProcessMonitorPrimitive.Root

const ProcessHoverCardTrigger = ProcessMonitorPrimitive.Trigger

const ProcessHoverCardContent = React.forwardRef<
	React.ElementRef<typeof ProcessMonitorPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof ProcessMonitorPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
	<ProcessMonitorPrimitive.Content
		ref={ref}
		align={align}
		sideOffset={sideOffset}
		collisionPadding={8}
		className={cn(className)}
		{...props}
	/>
))
ProcessHoverCardContent.displayName =
	ProcessMonitorPrimitive.Content.displayName

export { ProcessHoverCard, ProcessHoverCardContent, ProcessHoverCardTrigger }
