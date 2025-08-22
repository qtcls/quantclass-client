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
import { useNavigate } from "react-router"

export const BentoGrid = ({
	className,
	children,
}: {
	className?: string
	children?: React.ReactNode
}) => {
	return (
		<div
			className={cn(
				"mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 ",
				className,
			)}
		>
			{children}
		</div>
	)
}

export const BentoGridItem = ({
	className,
	title,
	description,
	header,
	icon,
	link,
}: {
	className?: string
	title?: string | React.ReactNode
	description?: string | React.ReactNode
	header?: React.ReactNode
	icon?: React.ReactNode
	link?: string
}) => {
	const navigate = useNavigate()

	return (
		<div
			className={cn(
				"group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-white p-4 shadow-input transition duration-200 hover:cursor-pointer hover:bg-slate-50 dark:border-white/[0.2] dark:bg-black dark:hover:bg-slate-800",
				className,
			)}
			onClick={() => navigate(link!)}
		>
			{header}
			<div className="transition duration-200">
				{icon}
				<div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
					{title}
				</div>
				<div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
					{description}
				</div>
			</div>
		</div>
	)
}
