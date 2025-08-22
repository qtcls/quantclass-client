/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

const { VITE_BASE_URL } = import.meta.env
const { rendererLog } = window.electronAPI

export const postUserAction = async (
	api_key: string,
	data: {
		uuid: string
		role: string
		action: string
	},
) => {
	try {
		if (!api_key || !data.uuid) {
			return
		}

		const response = await fetch(
			`${VITE_BASE_URL}/api/data/data_client_record/create`,
			{
				method: "POST",
				headers: {
					"api-key": api_key,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		)

		if (!response.ok) {
			const errorText = await response.text()
			rendererLog(
				"error",
				`请求失败 ${JSON.stringify(
					{
						status: response.status,
						statusText: response.statusText,
						error: errorText,
						requestData: data,
					},
					null,
					2,
				)}`,
			)
		}

		return response
	} catch (error) {
		rendererLog(
			"error",
			`[postUserAction] 请求异常: ${JSON.stringify(error, null, 2)}`,
		)
		throw error
	}
}

export const getStatusExpires = async (api_key: string, uuid: string) => {
	const response = await fetch(
		`${VITE_BASE_URL}/api/data/query/user/data_api/valid_to?uuid=${uuid}`,
		{
			method: "GET",
			headers: {
				"api-key": api_key,
				"Content-Type": "application/json",
			},
		},
	)

	if (!response.ok) {
		const errorText = await response.text()
		rendererLog(
			"error",
			`[getStatusExpires] 请求失败 ${JSON.stringify(
				{
					status: response.status,
					statusText: response.statusText,
					error: errorText,
				},
				null,
				2,
			)}`,
		)
		return { code: 400, message: errorText }
	}

	const json = await response.json()

	return json
}

export const getExtraWorkStatus = async (api_key: string, uuid: string) => {
	const response = await fetch(
		`${VITE_BASE_URL}/api/data/query/user/elective_hw?uuid=${uuid}`,
		{
			method: "GET",
			headers: {
				"api-key": api_key,
				"Content-Type": "application/json",
			},
		},
	)

	if (!response.ok) {
		const errorText = await response.text()

		rendererLog(
			"error",
			`[getExtraWorkStatus] 请求失败 ${JSON.stringify(
				{
					status: response.status,
					statusText: response.statusText,
					error: errorText,
				},
				null,
				2,
			)}`,
		)
	}
	try {
		const json = (await response.json()) as { data: boolean }
		return json
	} catch (error) {
		return { data: false }
	}
}
