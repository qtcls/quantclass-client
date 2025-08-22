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
import { useToggleAutoRealTrading } from "@/renderer/hooks/useToggleAutoRealTrading"
import { libraryTypeAtom } from "@/renderer/store/storage"
import { libraryShowAtom } from "@/renderer/store/storage"
import { Select, SelectItem } from "@heroui/select"
import { useAtomValue, useSetAtom } from "jotai"
export function ChangeLibrary({
	isButton = false,
	appendix = "",
}: { isButton?: boolean; appendix?: string }) {
	const libraryType = useAtomValue(libraryTypeAtom)
	const setLibraryShow = useSetAtom(libraryShowAtom)
	const { isAutoRocket } = useToggleAutoRealTrading()
	return (
		<div>
			{isButton ? (
				<Button
					disabled={isAutoRocket}
					onClick={() => {
						setLibraryShow(true)
					}}
					size="sm"
					variant="ringHover"
					className="h-7 w-16 text-sm"
				>
					启用
				</Button>
			) : (
				<div className="min-w-52">
					<Select
						isDisabled={isAutoRocket}
						label={<>切换策略库</>}
						isRequired
						variant="bordered"
						selectedKeys={[libraryType]}
						onChange={() => {
							setLibraryShow(true)
						}}
						// size="sm"
					>
						<SelectItem key="select">{"选股策略" + appendix}</SelectItem>
						<SelectItem key="pos">{"综合策略库" + appendix}</SelectItem>
					</Select>
				</div>
			)}
		</div>
	)
}
