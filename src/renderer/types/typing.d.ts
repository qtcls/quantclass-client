/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { ElectronAPI } from "@electron-toolkit/preload"

// 直接从preload模块提取类型
type SystemIPC = typeof import("@/preload/system/index.js").systemIPC
type FileSystemIPC = typeof import("@/preload/file-sys/index.js").fileSysIPC
type StoreIPC = typeof import("@/preload/store/index.js").storeIPC
type DataIPC = typeof import("@/preload/data/index.js").dataIPC
type EmitterIPC = typeof import("@/preload/emitter/index.js").emitterIPC
type CoreIPC = typeof import("@/preload/core/index.js").coreIPC

// 组合所有IPC类型
type CustomElectronAPI = SystemIPC &
	FileSystemIPC &
	StoreIPC &
	DataIPC &
	EmitterIPC &
	CoreIPC

interface Versions {
	node: () => string
	chrome: () => string
	electron: () => string
}

declare global {
	interface Window {
		electron: ElectronAPI
		versions: Versions
		electronAPI: CustomElectronAPI
	}
}

declare module "*.mdx" {
	let MDXComponent: (props: any) => JSX.Element
	export default MDXComponent
}

declare module "*.svg" {
	const content: any
	export default content
}

declare module "*.png" {
	const value: string
	export default value
}
