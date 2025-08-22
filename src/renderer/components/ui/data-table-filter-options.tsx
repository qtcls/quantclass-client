/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { Input } from "@/renderer/components/ui/input"
import { Table } from "@tanstack/react-table"
import { useUnmount } from "etc-hooks"
import { Search } from "lucide-react"
import { useEffect } from "react"

interface DataTableFilterOptionsProps<T> {
	table: Table<T>
	placeholder: string
	globalFilter: string
	setGlobalFilter: (value: string) => void
}

export function DataTableFilterOptions<T>({
	table,
	placeholder,
	globalFilter,
	setGlobalFilter,
}: DataTableFilterOptionsProps<T>) {
	useUnmount(() => {
		table.resetGlobalFilter()
	})

	useEffect(() => {
		// -- 移除了之前的条件检查，确保 globalFilter 的任何变化都会更新状态
		setGlobalFilter(globalFilter ?? "")
	}, [globalFilter, setGlobalFilter])

	return (
		<div className="relative">
			<Input
				placeholder={placeholder}
				className="h-8 w-[150px] lg:w-[250px] peer pe-9 ps-9"
				value={globalFilter ?? ""}
				onChange={(event) => {
					setGlobalFilter(event.target.value)
				}}
			/>
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
				<Search size={16} strokeWidth={2} />
			</div>
		</div>
	)
}
