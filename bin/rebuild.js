/*
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 * Licensed under BUSL-1.1 — see LICENSE.
 */

import { arch, platform } from "os"

// -- 判断是否需要重建
const shouldRebuild = () => {
	// -- Mac x64 架构不需要重建
	if (platform() === "darwin" && arch() === "x64") {
		console.log("Mac x64 架构无需重建原生模块")
		return false
	}
	if (platform() === "win32") {
		return false
	}
	return true
}

// -- 执行重建
const rebuild = async () => {
	if (shouldRebuild()) {
		const { execSync } = await import("child_process")
		try {
			// -- 设置环境变量禁用预构建
			process.env.npm_config_build_from_source = "true"
			execSync("electron-rebuild -f -w better-sqlite3", { stdio: "inherit" })
			execSync("electron-rebuild -f -w etc-csv-napi", { stdio: "inherit" })
		} catch (error) {
			console.error("重建失败:", error)
			process.exit(1)
		}
	}
}

rebuild()
