/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useMutation } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { toast } from "sonner"
import { isWindows } from "../constant"
import { versionAtom } from "../store/storage"
import { useInterval } from "./useInterval"

/**
 * -- 使用版本检查的自定义 Hook
 */
export const useVersionCheck = () => {
	const version = useAtomValue(versionAtom)
	const { checkUpdate } = window.electronAPI
	const { mutateAsync: checkForUpdate, error } = useMutation({
		mutationKey: ["check-update"],
		mutationFn: async () => await checkUpdate(),
	})

	const { start } = useInterval(
		async () => {
			const data = await checkForUpdate()
			if (data.updateInfo.version === version.clientVersion) {
				toast.dismiss()
				toast.info("当前已是最新版本")
			}
			if (data.updateInfo.version !== version.clientVersion) {
				if (isWindows) {
					toast.dismiss()
					toast.info("发现可用新版本，开始下载")
					return
				}
				toast.dismiss()
				toast.info("发现可用新版本，请从网站上下载覆盖更新", {
					duration: 5 * 1000,
				})
			}
			if (error) {
				toast.error("检查更新失败")
			}
		},
		1000 * 60 * 60 * 2,
	)

	return { start }
}
