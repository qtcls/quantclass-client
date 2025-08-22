/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { isNumber } from "@/renderer/utils"
import { useLatest } from "etc-hooks"
import { useCallback, useEffect, useRef } from "react"

interface Handle {
	id: number | ReturnType<typeof setInterval>
}

const setRafInterval = (callback: () => void, delay = 0): Handle => {
	if (typeof requestAnimationFrame === typeof undefined) {
		return {
			id: setInterval(callback, delay),
		}
	}
	let start = Date.now()
	const handle: Handle = {
		id: 0,
	}
	const loop = () => {
		const current = Date.now()
		if (current - start >= delay) {
			callback()
			start = Date.now()
		}
		handle.id = requestAnimationFrame(loop)
	}
	handle.id = requestAnimationFrame(loop)
	return handle
}

function cancelAnimationFrameIsNotDefined(
	_t: any,
): _t is ReturnType<typeof setInterval> {
	return typeof cancelAnimationFrame === typeof undefined
}

const clearRafInterval = (handle: Handle) => {
	if (cancelAnimationFrameIsNotDefined(handle.id)) {
		return clearInterval(handle.id)
	}
	cancelAnimationFrame(handle.id)
}

function useRafInterval(
	fn: () => void,
	delay: number | undefined,
	options?: {
		immediate?: boolean
	},
) {
	const immediate = options?.immediate

	const fnRef = useLatest(fn)
	const timerRef = useRef<Handle>()

	const clear = useCallback(() => {
		if (timerRef.current) {
			clearRafInterval(timerRef.current)
		}
	}, [])

	useEffect(() => {
		if (!isNumber(delay) || delay < 0) {
			return
		}
		if (immediate) {
			fnRef.current()
		}
		timerRef.current = setRafInterval(() => {
			fnRef.current()
		}, delay)
		return clear
	}, [delay])

	return clear
}

export default useRafInterval
