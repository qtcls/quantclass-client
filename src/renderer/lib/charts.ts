/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export function themeColorsToCssVariables(
	colors: Record<string, string>,
): Record<string, string> {
	const cssVars = colors
		? Object.fromEntries(
				Object.entries(colors).map(([name, value]) => {
					if (value === undefined) return []
					const cssName = themeColorNameToCssVariable(name)
					return [cssName, value]
				}),
			)
		: {}

	// for (const key of Array.from({ length: 5 }, (_, index) => index)) {
	//   cssVars[`--chart-${key + 1}`] =
	//     cssVars[`--chart-${key + 1}`] ||
	//     `${cssVars["--primary"]} / ${100 - key * 20}%`
	// }

	return cssVars
}

export function themeColorNameToCssVariable(name: string) {
	return `--${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`
}
