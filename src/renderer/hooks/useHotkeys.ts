/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	type HotkeyItemOptions,
	getHotkeyHandler,
	getHotkeyMatcher,
} from "@/renderer/utils/parseHotkey"
import { useEffect } from "react"

export { getHotkeyHandler }
export type { HotkeyItemOptions }

export type HotkeyItem = [
	string,
	(event: KeyboardEvent) => void,
	HotkeyItemOptions?,
]

function shouldFireEvent(
	event: KeyboardEvent,
	tagsToIgnore: string[],
	triggerOnContentEditable = false,
) {
	if (event.target instanceof HTMLElement) {
		if (triggerOnContentEditable) {
			return !tagsToIgnore.includes(event.target.tagName)
		}

		return (
			!event.target.isContentEditable &&
			!tagsToIgnore.includes(event.target.tagName)
		)
	}

	return true
}

export function useHotkeys(
	hotkeys: HotkeyItem[],
	tagsToIgnore: string[] = ["INPUT", "TEXTAREA", "SELECT"],
	triggerOnContentEditable = false,
) {
	useEffect(() => {
		const keydownListener = (event: KeyboardEvent) => {
			for (const [
				hotkey,
				handler,
				options = { preventDefault: true },
			] of hotkeys) {
				if (
					getHotkeyMatcher(hotkey)(event) &&
					shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
				) {
					if (options.preventDefault) {
						event.preventDefault()
					}

					handler(event)
				}
			}
		}

		document.documentElement.addEventListener("keydown", keydownListener)
		return () =>
			document.documentElement.removeEventListener("keydown", keydownListener)
	}, [hotkeys])
}
