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
import { ReactNode } from "react"

export function H1({ children }: { children: ReactNode }) {
	return (
		<h1 className="text-foreground scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			{children}
		</h1>
	)
}

export function H2({ children }: { children: ReactNode }) {
	return (
		<h2 className="text-foreground scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
			{children}
		</h2>
	)
}

export function H3({
	children,
	className,
}: { children: ReactNode; className?: string }) {
	return (
		<h3
			className={cn(
				"text-foreground scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
		>
			{children}
		</h3>
	)
}

export function H4({
	children,
	className,
}: { children: ReactNode; className?: string }) {
	return (
		<h4
			className={cn(
				"text-foreground scroll-m-20 text-xl font-semibold tracking-tight",
				className,
			)}
		>
			{children}
		</h4>
	)
}

export function P({ children }: { children: ReactNode }) {
	return (
		<p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">
			{children}
		</p>
	)
}

export function InlineCode({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<code
			className={cn(
				"text-foreground relative rounded bg-muted px-[0.3rem] py-[0.1rem] font-mono text-sm font-semibold",
				className,
			)}
		>
			{children}
		</code>
	)
}
