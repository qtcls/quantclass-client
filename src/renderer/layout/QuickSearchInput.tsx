/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import * as React from "react"

import { isWindows } from "@/renderer/constant"
import { cn } from "@/renderer/lib/utils"
import { isShowSpotlightAtom } from "@/renderer/store"
import { useSetAtom } from "jotai"
import { SearchIcon } from "lucide-react"
import { Spotlight } from "./spolight"

export interface QuickSearchInputProps
	extends React.HTMLAttributes<HTMLDivElement> {
	// -- 自定义属性
	shortcut?: string
}

const QuickSearchInput = React.forwardRef<
	HTMLDivElement,
	QuickSearchInputProps
>(({ className, shortcut, ...props }, ref) => {
	const defaultShortcut = isWindows ? "Ctrl + K" : "⌘ + K"
	const setIsShowSpotlight = useSetAtom(isShowSpotlightAtom)

	return (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 rounded-lg cursor-pointer relative overflow-hidden border",
				className,
			)}
			{...props}
			onClick={() => setIsShowSpotlight((prev) => !prev)}
		>
			<SearchIcon className="h-4 w-4" />
			<span>快速搜索</span>
			<div className="flex-1" />
			<kbd className="text-xs">{shortcut || defaultShortcut}</kbd>
			<Spotlight />
		</div>
	)
})

QuickSearchInput.displayName = "QuickSearchInput"

export { QuickSearchInput }
