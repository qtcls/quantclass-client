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
import { VariantProps, cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva("flex-col items-center justify-center", {
	variants: {
		show: {
			true: "flex",
			false: "hidden",
		},
	},
	defaultVariants: {
		show: true,
	},
})

const loaderVariants = cva("animate-spin text-primary", {
	variants: {
		size: {
			small: "size-6",
			medium: "size-8",
			large: "size-12",
		},
	},
	defaultVariants: {
		size: "medium",
	},
})

interface SpinnerContentProps
	extends VariantProps<typeof spinnerVariants>,
		VariantProps<typeof loaderVariants> {
	className?: string
	children?: React.ReactNode
}

export function Spinner({
	size,
	show,
	children,
	className,
}: SpinnerContentProps) {
	return (
		<span className={spinnerVariants({ show })}>
			<Loader2 className={cn(loaderVariants({ size }), className)} />
			{children}
		</span>
	)
}
