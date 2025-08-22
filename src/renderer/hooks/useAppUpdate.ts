/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { _ipcRenderer } from "@/renderer/constant"
import { UpdateStatus, useUpdate } from "@/renderer/context/update-context"
import {
	onUpdateProgress,
	unUpdateProgressListener,
} from "@/renderer/ipc/listener"
import { useEffect } from "react"

export const useAppUpdate = () => {
	const {
		status,
		setStatus,
		progress,
		setProgress,
		updateInfo,
		setUpdateInfo,
	} = useUpdate()

	const confirmCallback = (option: boolean) => {
		if (option) {
			_ipcRenderer.send("app-updater-confirm", option)
			setStatus(UpdateStatus.Waiting)
		}
	}

	useEffect(() => {
		onUpdateProgress((progress) => {
			if (status === UpdateStatus.Waiting) {
				setStatus(UpdateStatus.Downloading)
			}
			if (progress.percent === 100) {
				setStatus(UpdateStatus.Confirm)
			}
			setProgress(progress)
		})

		return () => {
			unUpdateProgressListener()
		}
	}, [status])

	return {
		status,
		setStatus,
		progress,
		confirmCallback,
		updateInfo,
		setUpdateInfo,
	}
}
