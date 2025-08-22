/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { BaseColor } from "@/registry/registry-base-color"
import type { Style } from "@/registry/registry-styles"

type Config = {
	style: Style["name"]
	theme: BaseColor["name"]
	radius: number
}

const configAtom = atomWithStorage<Config>(
	"config",
	{
		style: "default",
		theme: "zinc",
		radius: 0.5,
	},
	undefined,
	{
		getOnInit: true,
	},
)

export function useConfig() {
	return useAtom(configAtom)
}
