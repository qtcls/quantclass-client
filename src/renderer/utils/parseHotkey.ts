/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export type KeyboardModifiers = {
	alt: boolean
	ctrl: boolean
	meta: boolean
	mod: boolean
	shift: boolean
}

export type Hotkey = KeyboardModifiers & {
	key?: string
}

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean

export function parseHotkey(hotkey: string): Hotkey {
	const keys = hotkey
		.toLowerCase()
		.split("+")
		.map((part) => part.trim())

	const modifiers: KeyboardModifiers = {
		alt: keys.includes("alt"),
		ctrl: keys.includes("ctrl"),
		meta: keys.includes("meta"),
		mod: keys.includes("mod"),
		shift: keys.includes("shift"),
	}

	const reservedKeys = ["alt", "ctrl", "meta", "shift", "mod"]

	const freeKey = keys.find((key) => !reservedKeys.includes(key))

	return {
		...modifiers,
		key: freeKey,
	}
}

function isExactHotkey(hotkey: Hotkey, event: KeyboardEvent): boolean {
	const { alt, ctrl, meta, mod, shift, key } = hotkey
	const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event

	if (alt !== altKey) {
		return false
	}

	if (mod) {
		if (!ctrlKey && !metaKey) {
			return false
		}
	} else {
		if (ctrl !== ctrlKey) {
			return false
		}
		if (meta !== metaKey) {
			return false
		}
	}
	if (shift !== shiftKey) {
		return false
	}

	if (
		key &&
		(pressedKey.toLowerCase() === key.toLowerCase() ||
			event.code.replace("Key", "").toLowerCase() === key.toLowerCase())
	) {
		return true
	}

	return false
}

export function getHotkeyMatcher(hotkey: string): CheckHotkeyMatch {
	return (event) => isExactHotkey(parseHotkey(hotkey), event)
}

export interface HotkeyItemOptions {
	preventDefault?: boolean
}

type HotkeyItem = [string, (event: any) => void, HotkeyItemOptions?]

export function getHotkeyHandler(hotkeys: HotkeyItem[]) {
	return (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
		const _event = "nativeEvent" in event ? event.nativeEvent : event
		for (const [
			hotkey,
			handler,
			options = { preventDefault: true },
		] of hotkeys) {
			if (getHotkeyMatcher(hotkey)(_event)) {
				if (options.preventDefault) {
					event.preventDefault()
				}

				handler(_event)
			}
		}
	}
}
