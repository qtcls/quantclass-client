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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/renderer/components/ui/select"
import { cn } from "@/renderer/lib/utils"
import { Column, RowData } from "@tanstack/react-table"
import React, { useEffect, useMemo, useState } from "react"

interface DataTableHeaderFilterProps<TData> {
	column: Column<TData, unknown>
	placeholder?: string
	className?: string
	formatSelectLabel?: (value: string) => string
}

declare module "@tanstack/react-table" {
	//allows us to define custom properties for our columns
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: "text" | "range" | "select"
	}
}

export function DataTableHeaderFilter<TData>({
	column,
	className,
	placeholder,
	formatSelectLabel,
}: DataTableHeaderFilterProps<TData>) {
	const { filterVariant } = column.columnDef.meta ?? {}

	const columnFilterValue = column.getFilterValue()

	const sortedUniqueValues = useMemo(
		() =>
			filterVariant === "range"
				? []
				: Array.from(column.getFacetedUniqueValues().keys())
						.sort()
						.slice(0, 5000),
		[column.getFacetedUniqueValues(), filterVariant],
	)

	if (filterVariant === "range") {
		return (
			<div className="flex space-x-2">
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [value, old?.[1]])
					}
					placeholder={`最小 ${
						column.getFacetedMinMaxValues()?.[0] !== undefined
							? `(${column.getFacetedMinMaxValues()?.[0]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [old?.[0], value])
					}
					placeholder={`最大 ${
						column.getFacetedMinMaxValues()?.[1]
							? `(${column.getFacetedMinMaxValues()?.[1]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
			</div>
		)
	}

	if (filterVariant === "select") {
		const [selectValue, setSelectValue] = useState<string | undefined>(
			columnFilterValue?.toString(),
		)

		useEffect(() => {
			setSelectValue(columnFilterValue?.toString() ?? "")
		}, [columnFilterValue])

		return (
			<Select
				value={selectValue}
				onValueChange={(value) => {
					setSelectValue(value || undefined)
					column.setFilterValue(value || undefined)
				}}
			>
				<SelectTrigger className={cn("w-[120px] h-7", className)}>
					<SelectValue placeholder={placeholder}>
						{selectValue && formatSelectLabel
							? formatSelectLabel(selectValue)
							: selectValue}
					</SelectValue>
				</SelectTrigger>

				<SelectContent>
					{sortedUniqueValues.length === 0 ? (
						<div className="relative flex items-center justify-center py-2 text-sm text-muted-foreground">
							暂无数据
						</div>
					) : (
						sortedUniqueValues.map((value: string) => (
							<SelectItem value={value} key={value}>
								{formatSelectLabel ? formatSelectLabel(value) : value}
							</SelectItem>
						))
					)}
				</SelectContent>
			</Select>
		)
	}

	return (
		<>
			<DebouncedInput
				type="text"
				value={(columnFilterValue ?? "") as string}
				onChange={(value) => column.setFilterValue(value)}
				placeholder={`搜索... (${column.getFacetedUniqueValues().size})`}
				className="w-36 border shadow rounded"
				list={column.id + "list"}
			/>
		</>
	)
}

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = React.useState(initialValue)

	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value])

	return (
		<Input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	)
}
