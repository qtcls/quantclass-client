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
import { DataTableFilterOptions } from "@/renderer/components/ui/data-table-filter-options"
import { DataTableViewOptions } from "@/renderer/components/ui/data-table-view-options"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	placeholder: string
	globalFilter: string
	enableViewOptions?: boolean
	enableSearch?: boolean
	setGlobalFilter: (value: string) => void
	children?: React.ReactNode
	actionPosition?: "left" | "right"
}

export function DataTableToolbar<TData>({
	table,
	placeholder,
	globalFilter,
	enableViewOptions = false,
	enableSearch = true,
	setGlobalFilter,
	children,
	actionPosition = "right",
}: DataTableToolbarProps<TData>) {
	const isFiltered =
		table.getState().columnFilters.length > 0 ||
		table.getState().globalFilter?.length > 0

	const actions = (
		<div className="flex items-center gap-2">
			{isFiltered && (
				<Button
					variant="ghost"
					onClick={() => {
						table.resetColumnFilters()
						table.resetGlobalFilter()
					}}
					className="h-8 px-2 lg:px-3"
				>
					清空过滤
					<Cross2Icon className="ml-2 h-4 w-4" />
				</Button>
			)}

			{enableSearch && (
				<DataTableFilterOptions
					table={table}
					placeholder={placeholder}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
			)}

			{enableViewOptions && <DataTableViewOptions table={table} />}
		</div>
	)

	return (
		<div className="flex items-center justify-between">
			{actionPosition === "left" ? (
				actions
			) : (
				<div className="flex items-center gap-2">{children}</div>
			)}
			{actionPosition === "left" ? (
				<div className="flex items-center gap-2">{children}</div>
			) : (
				actions
			)}
		</div>
	)
}
