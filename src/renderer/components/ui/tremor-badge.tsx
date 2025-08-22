/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import React from "react"
import { type VariantProps, tv } from "tailwind-variants"

import { cn } from "@renderer/lib/utils"

const TremorBadgeVariants = tv({
	base: cn(
		"inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
	),
	variants: {
		variant: {
			default: [
				"bg-blue-50 text-blue-900 ring-blue-500/30",
				"dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
			],
			neutral: [
				"bg-gray-50 text-gray-900 ring-gray-500/30",
				"dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
			],
			success: [
				"bg-emerald-50 text-emerald-900 ring-emerald-600/30",
				"dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
			],
			error: [
				"bg-red-50 text-red-900 ring-red-600/20",
				"dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
			],
			warning: [
				"bg-yellow-50 text-yellow-900 ring-yellow-600/30",
				"dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
			],
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

interface TremorBadgeProps
	extends React.ComponentPropsWithoutRef<"span">,
		VariantProps<typeof TremorBadgeVariants> {}

const TremorBadge = React.forwardRef<HTMLSpanElement, TremorBadgeProps>(
	({ className, variant, ...props }: TremorBadgeProps, forwardedRef) => {
		return (
			<span
				ref={forwardedRef}
				className={cn(TremorBadgeVariants({ variant }), className)}
				tremor-id="tremor-raw"
				{...props}
			/>
		)
	},
)

TremorBadge.displayName = "TremorBadge"

export { TremorBadge, TremorBadgeVariants, type TremorBadgeProps }
