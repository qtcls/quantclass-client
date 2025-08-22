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
import { useEffect } from "react"
import { userInfoMutationAtom } from "../store/mutation"
import { userAtom } from "../store/user"
import { useInterval } from "./useInterval"

/**
 * -- 使用用户信息同步的自定义 Hook
 */
export const useUserInfoSync = () => {
	const [{ user, isLoggedIn, token }, setUser] = useAtom(userAtom)
	const [{ mutateAsync: fetchUserInfo }] = useAtom(userInfoMutationAtom)

	const { start, stop } = useInterval(
		async () => {
			const res = await fetchUserInfo(token)
			setUser((prev) => ({
				...prev,
				user: res,
			}))
		},
		1000 * 60 * 60 * 2,
	)

	useEffect(() => {
		if (isLoggedIn) {
			start()
		} else {
			stop()
		}
		return () => stop()
	}, [isLoggedIn])

	return { user, isLoggedIn }
}
