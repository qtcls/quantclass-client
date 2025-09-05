/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import fs from "node:fs/promises"
import store from "../store/index.js"
import { PACKAGE_INFO } from "../vars.js"

export async function getCoreVersion(coreName = "fuel") {
	try {
		const codePath = await store.getAllDataPath(["code"])
		// 读取该目录下的所有 .yml 文件
		const files = await fs.readdir(codePath)

		const ymlFiles = files.filter((file: string) => file.endsWith(".yml"))
		// 判断是否存在 yml 文件
		if (ymlFiles.length === 0) return "暂无内核"

		// 获取yml文件的文件名（假设只有一个 yml 文件）
		const ymlFile = ymlFiles.find((file: string) => file.startsWith(coreName))!
		return ymlFile.replace(".yml", "")
	} catch (error) {
		return "暂无内核"
	}
}

/**
 * 检查本地的客户端版本，包括 Python Core 和客户端版本
 */
export async function getCoreAndClientVersions() {
	try {
		const { version } = PACKAGE_INFO
		const fuelVersion = await getCoreVersion("fuel")
		const aquaVersion = await getCoreVersion("aqua")
		const rocketVersion = await getCoreVersion("rocket")
		const zeusVersion = await getCoreVersion("zeus")
		let coreVersionStatus = false

		if (fuelVersion !== "暂无内核") {
			coreVersionStatus = true
		}

		const clientVersion = version

		return {
			coreVersion: fuelVersion,
			clientVersion,
			coreVersionStatus,
			aquaVersion,
			zeusVersion,
			rocketVersion,
		}
	} catch (error) {
		const { version } = PACKAGE_INFO

		return {
			coreVersion: "未配置内核路径",
			clientVersion: version,
			coreVersionStatus: false,
			aquaVersion: "未配置内核路径",
			zeusVersion: "未配置内核路径",
			rocketVersion: "未配置内核路径",
		}
	}
}
