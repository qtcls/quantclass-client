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
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useEffect, useState } from "react"
import {
	atomWithElectronStore,
	atomWithElectronStorePro,
	cacheUtils,
	useElectronStoreInit,
	useSyncAtom,
} from "../utils/store"

// ============================================================================
// 📝 示例 1：基础的 atom（纯内存）
// ============================================================================

const memoryAtom = atom({ sidebarCollapsed: false, lastOpenedFile: "" })

function MemoryExample() {
	const [state, setState] = useAtom(memoryAtom)

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">📝 纯内存 Atom</h3>
			<p className="text-sm text-gray-600 mb-3">
				数据存储：仅内存 | 刷新后：❌ 丢失 | 跨窗口：❌ 不同步 | 用法：
				<code>useAtom</code>
			</p>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<span>侧边栏状态:</span>
					<button
						className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
						onClick={() =>
							setState((prev) => ({
								...prev,
								sidebarCollapsed: !prev.sidebarCollapsed,
							}))
						}
					>
						{state.sidebarCollapsed ? "展开" : "收起"}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span>最后文件:</span>
					<input
						type="text"
						value={state.lastOpenedFile}
						onChange={(e) =>
							setState((prev) => ({ ...prev, lastOpenedFile: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
						placeholder="输入文件名"
					/>
				</div>

				<div className="text-xs text-gray-500 mt-2">
					当前值: {JSON.stringify(state)}
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// 💾 示例 2：atomWithStorage（localStorage 持久化）
// ============================================================================

const localStorageAtom = atomWithStorage("app-config", {
	sidebarCollapsed: false as boolean,
	lastOpenedFile: "",
})

function LocalStorageExample() {
	const [state, setState] = useAtom(localStorageAtom)

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">💾 localStorage Atom</h3>
			<p className="text-sm text-gray-600 mb-3">
				数据存储：localStorage | 刷新后：✅ 保持 | 跨窗口：✅ 部分同步 | 用法：
				<code>useAtom</code>
			</p>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<span>侧边栏状态:</span>
					<button
						className="px-3 py-1 bg-green-500 text-white rounded text-sm"
						onClick={() =>
							setState((prev) => ({
								...prev,
								sidebarCollapsed: !prev.sidebarCollapsed,
							}))
						}
					>
						{state.sidebarCollapsed ? "展开" : "收起"}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span>最后文件:</span>
					<input
						type="text"
						value={state.lastOpenedFile}
						onChange={(e) =>
							setState((prev) => ({ ...prev, lastOpenedFile: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
						placeholder="输入文件名"
					/>
				</div>

				<div className="text-xs text-gray-500 mt-2">
					当前值: {JSON.stringify(state)}
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// 🚀 示例 3：atomWithElectronStore（简化版本）
// ============================================================================

const simpleElectronAtom = atomWithElectronStore("simple-config", {
	sidebarCollapsed: false,
	lastOpenedFile: "",
})

function SimpleElectronStoreExample() {
	const [state, setState] = useAtom(simpleElectronAtom)

	// 手动初始化（可选）
	useElectronStoreInit(simpleElectronAtom)

	const handleRefresh = async () => {
		const latestValue = await (simpleElectronAtom as any).loadFromStore()
		setState(latestValue)
	}

	const handleForceRefresh = async () => {
		const latestValue = await (simpleElectronAtom as any).loadFromStore(true)
		setState(latestValue)
	}

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">🚀 简化版 Electron Store</h3>
			<p className="text-sm text-gray-600 mb-3">
				数据存储：Electron Store | 刷新后：✅ 保持 | 跨窗口：❌ 手动同步 |
				用法：<code>useAtom</code>
			</p>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<span>侧边栏状态:</span>
					<button
						className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
						onClick={() =>
							setState((prev) => ({
								...prev,
								sidebarCollapsed: !prev.sidebarCollapsed,
							}))
						}
					>
						{state.sidebarCollapsed ? "展开" : "收起"}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span>最后文件:</span>
					<input
						type="text"
						value={state.lastOpenedFile}
						onChange={(e) =>
							setState((prev) => ({ ...prev, lastOpenedFile: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
						placeholder="输入文件名"
					/>
				</div>

				<div className="flex items-center space-x-2">
					<button
						onClick={handleRefresh}
						className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
					>
						🔄 刷新 (带缓存)
					</button>
					<button
						onClick={handleForceRefresh}
						className="px-3 py-1 bg-red-500 text-white rounded text-sm"
					>
						⚡ 强制刷新
					</button>
				</div>

				<div className="text-xs text-gray-500 mt-2">
					当前值: {JSON.stringify(state)}
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// 🏆 示例 4：atomWithElectronStorePro（专业版本）
// ============================================================================

const proElectronAtom = atomWithElectronStorePro("pro-config", {
	sidebarCollapsed: false,
	lastOpenedFile: "",
})

function ProElectronStoreExample() {
	const [state, setState] = useSyncAtom(proElectronAtom)

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">🏆 专业版 Electron Store</h3>
			<p className="text-sm text-gray-600 mb-3">
				数据存储：Electron Store | 刷新后：✅ 保持 | 跨窗口：✅ 自动同步 |
				用法：<code>useSyncAtom</code>
			</p>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<span>侧边栏状态:</span>
					<button
						className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
						onClick={() =>
							setState((prev) => ({
								...prev,
								sidebarCollapsed: !prev.sidebarCollapsed,
							}))
						}
					>
						{state.sidebarCollapsed ? "展开" : "收起"}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span>最后文件:</span>
					<input
						type="text"
						value={state.lastOpenedFile}
						onChange={(e) =>
							setState((prev) => ({ ...prev, lastOpenedFile: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
						placeholder="输入文件名"
					/>
				</div>

				<div className="text-xs text-gray-500 mt-2">
					当前值: {JSON.stringify(state)}
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// 🔗 示例 5：混合存储（专业版 + localStorage）
// ============================================================================

const hybridStoreAtom = atomWithElectronStorePro(
	"hybrid-config",
	{
		sidebarCollapsed: false,
		lastOpenedFile: "",
	},
	{ useLocalStorage: true }, // 同时启用 localStorage
)

function HybridStoreExample() {
	const [state, setState] = useSyncAtom(hybridStoreAtom)

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">
				🔗 混合存储 (localStorage + Electron)
			</h3>
			<p className="text-sm text-gray-600 mb-3">
				数据存储：localStorage + Electron Store | 刷新后：✅ 保持 | 跨窗口：✅
				自动同步 | 用法：<code>useSyncAtom</code>
			</p>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<span>侧边栏状态:</span>
					<button
						className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
						onClick={() =>
							setState((prev) => ({
								...prev,
								sidebarCollapsed: !prev.sidebarCollapsed,
							}))
						}
					>
						{state.sidebarCollapsed ? "展开" : "收起"}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span>最后文件:</span>
					<input
						type="text"
						value={state.lastOpenedFile}
						onChange={(e) =>
							setState((prev) => ({ ...prev, lastOpenedFile: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
						placeholder="输入文件名"
					/>
				</div>

				<div className="text-xs text-gray-500 mt-2">
					当前值: {JSON.stringify(state)}
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// 🎛️ 示例 6：缓存状态演示
// ============================================================================

function CacheStatusExample() {
	const [cacheStats, setCacheStats] = useState<
		Array<{ key: string; age: number; expired: boolean }>
	>([])

	const updateCacheStats = () => {
		setCacheStats(cacheUtils.getStats())
	}

	useEffect(() => {
		// 初始化显示缓存状态
		updateCacheStats()

		// 定期更新缓存状态
		const interval = setInterval(updateCacheStats, 1000)
		return () => clearInterval(interval)
	}, [])

	const handleClearCache = () => {
		cacheUtils.clearAll()
		updateCacheStats()
	}

	const handleClearExpired = () => {
		cacheUtils.clearExpired()
		updateCacheStats()
	}

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">💾 缓存状态监控</h3>
			<p className="text-sm text-gray-600 mb-3">
				实时显示 IPC 缓存状态，缓存有效期：1.5秒
			</p>

			<div className="space-y-3">
				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium">
						缓存数量: {cacheUtils.getSize()}
					</span>
					<button
						onClick={handleClearCache}
						className="px-2 py-1 bg-orange-500 text-white rounded text-xs"
					>
						清除全部
					</button>
					<button
						onClick={handleClearExpired}
						className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
					>
						清除过期
					</button>
					<button
						onClick={updateCacheStats}
						className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
					>
						刷新状态
					</button>
				</div>

				{cacheStats.length > 0 && (
					<div className="text-xs">
						<div className="font-medium mb-1">缓存详情:</div>
						<div className="bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
							{cacheStats.map((stat, index) => (
								<div
									key={index}
									className={`mb-1 ${
										stat.expired ? "text-red-600" : "text-green-600"
									}`}
								>
									<span className="font-mono">{stat.key}</span>:{" "}
									{Math.round(stat.age / 1000)}s{stat.expired && " (已过期)"}
								</div>
							))}
						</div>
					</div>
				)}

				{cacheStats.length === 0 && (
					<div className="text-xs text-gray-500">暂无缓存数据</div>
				)}
			</div>
		</div>
	)
}

// ============================================================================
// 🎛️ 示例 7：监听器和高级功能
// ============================================================================

const advancedAtom = atomWithElectronStorePro("advanced-config", {
	theme: "light",
	notifications: true,
	autoSave: false,
})

function AdvancedExample() {
	const [config, setConfig] = useSyncAtom(advancedAtom, (newConfig) => {
		console.log("配置已更新:", newConfig)
	})

	const [logs, setLogs] = useState<string[]>([])

	// 手动监听器示例
	useEffect(() => {
		const unsubscribe = advancedAtom.subscribe((_value) => {
			const timestamp = new Date().toLocaleTimeString()
			setLogs((prev) => [
				...prev.slice(-4),
				`${timestamp}: 配置已同步到 Electron Store`,
			])
		})

		return unsubscribe
	}, [])

	const handleRefresh = async () => {
		try {
			const latestConfig = await advancedAtom.refresh()
			setConfig(latestConfig)
			const timestamp = new Date().toLocaleTimeString()
			setLogs((prev) => [
				...prev.slice(-4),
				`${timestamp}: 已从 Electron Store 刷新 (带缓存)`,
			])
		} catch (error) {
			console.error("刷新失败:", error)
		}
	}

	const handleForceRefresh = async () => {
		try {
			const latestConfig = await advancedAtom.refresh(true)
			setConfig(latestConfig)
			const timestamp = new Date().toLocaleTimeString()
			setLogs((prev) => [
				...prev.slice(-4),
				`${timestamp}: 已从 Electron Store 强制刷新`,
			])
		} catch (error) {
			console.error("强制刷新失败:", error)
		}
	}

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">🎛️ 高级功能演示</h3>
			<p className="text-sm text-gray-600 mb-3">
				演示监听器、手动刷新、跨窗口通知等专业版功能
			</p>

			<div className="space-y-3">
				{/* 主题切换 */}
				<div className="flex items-center space-x-2">
					<span>主题:</span>
					<select
						value={config.theme}
						onChange={(e) =>
							setConfig((prev) => ({ ...prev, theme: e.target.value }))
						}
						className="px-2 py-1 border rounded text-sm"
					>
						<option value="light">浅色</option>
						<option value="dark">深色</option>
						<option value="auto">自动</option>
					</select>
				</div>

				{/* 通知开关 */}
				<div className="flex items-center space-x-2">
					<span>通知:</span>
					<button
						className={`px-3 py-1 rounded text-sm ${
							config.notifications
								? "bg-green-500 text-white"
								: "bg-gray-300 text-gray-700"
						}`}
						onClick={() =>
							setConfig((prev) => ({
								...prev,
								notifications: !prev.notifications,
							}))
						}
					>
						{config.notifications ? "开启" : "关闭"}
					</button>
				</div>

				{/* 自动保存 */}
				<div className="flex items-center space-x-2">
					<span>自动保存:</span>
					<button
						className={`px-3 py-1 rounded text-sm ${
							config.autoSave
								? "bg-blue-500 text-white"
								: "bg-gray-300 text-gray-700"
						}`}
						onClick={() =>
							setConfig((prev) => ({ ...prev, autoSave: !prev.autoSave }))
						}
					>
						{config.autoSave ? "开启" : "关闭"}
					</button>
				</div>

				{/* 手动刷新按钮 */}
				<div className="flex items-center space-x-2">
					<button
						onClick={handleRefresh}
						className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
					>
						🔄 刷新 (带缓存)
					</button>
					<button
						onClick={handleForceRefresh}
						className="px-3 py-1 bg-red-500 text-white rounded text-sm"
					>
						⚡ 强制刷新
					</button>
				</div>

				{/* 当前配置显示 */}
				<div className="text-xs text-gray-500 mt-2">
					当前配置: {JSON.stringify(config)}
				</div>

				{/* 操作日志 */}
				{logs.length > 0 && (
					<div className="mt-3">
						<div className="text-sm font-medium mb-1">操作日志:</div>
						<div className="text-xs bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
							{logs.map((log, index) => (
								<div key={index} className="text-gray-600">
									{log}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

// ============================================================================
// 🚀 主组件
// ============================================================================

export default function AtomWithStoreExamples() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-2">Jotai 存储方案对比</h1>
				<p className="text-gray-600">演示不同存储方案的特点和适用场景</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<MemoryExample />
				<LocalStorageExample />
				<SimpleElectronStoreExample />
				<ProElectronStoreExample />
				<HybridStoreExample />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<CacheStatusExample />
				<AdvancedExample />
			</div>

			{/* 对比表格 */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">📊 功能对比</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left">
									存储类型
								</th>
								<th className="border border-gray-300 px-4 py-2 text-center">
									数据持久化
								</th>
								<th className="border border-gray-300 px-4 py-2 text-center">
									跨窗口同步
								</th>
								<th className="border border-gray-300 px-4 py-2 text-center">
									使用复杂度
								</th>
								<th className="border border-gray-300 px-4 py-2 text-center">
									适用场景
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-300 px-4 py-2 font-medium">
									📝 atom (纯内存)
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									❌
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									❌
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									🟢 简单
								</td>
								<td className="border border-gray-300 px-4 py-2">
									临时状态、UI 状态
								</td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-4 py-2 font-medium">
									💾 atomWithStorage
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									⚠️ 部分
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									🟢 简单
								</td>
								<td className="border border-gray-300 px-4 py-2">
									用户偏好、缓存
								</td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-4 py-2 font-medium">
									🚀 atomWithElectronStore
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									⚠️ 手动
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									🟢 简单
								</td>
								<td className="border border-gray-300 px-4 py-2">
									应用配置、简单需求
								</td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-4 py-2 font-medium">
									🏆 atomWithElectronStorePro
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅ 自动
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									🟡 中等
								</td>
								<td className="border border-gray-300 px-4 py-2">
									多窗口应用、核心数据
								</td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-4 py-2 font-medium">
									🔗 混合存储
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅✅
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									✅ 自动
								</td>
								<td className="border border-gray-300 px-4 py-2 text-center">
									🟡 中等
								</td>
								<td className="border border-gray-300 px-4 py-2">
									关键配置、多重备份
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* 使用建议 */}
			<div className="mt-8 p-4 bg-blue-50 rounded-lg">
				<h3 className="text-lg font-semibold mb-2">💡 选择指南</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<h4 className="font-medium mb-2">
							🚀 简化版本 (atomWithElectronStore)
						</h4>
						<ul className="space-y-1">
							<li>
								✅ 使用 <code>useAtom</code>，学习成本低
							</li>
							<li>✅ 代码简洁，易于理解</li>
							<li>✅ 适合单窗口应用</li>
							<li>✅ 内置 IPC 缓存机制（1.5秒TTL）</li>
							<li>⚠️ 需要手动处理跨窗口同步</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium mb-2">
							🏆 专业版本 (atomWithElectronStorePro)
						</h4>
						<ul className="space-y-1">
							<li>✅ 自动跨窗口同步</li>
							<li>✅ 完整的错误处理</li>
							<li>✅ 监听器管理</li>
							<li>✅ 内置 IPC 缓存机制（1.5秒TTL）</li>
							<li>
								⚠️ 需要使用 <code>useSyncAtom</code>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* 代码示例 */}
			<div className="mt-8 p-4 bg-gray-50 rounded-lg">
				<h3 className="text-lg font-semibold mb-2">🔧 代码示例</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-medium mb-2">简化版本</h4>
						<pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
							{`// 创建 atom
const myAtom = atomWithElectronStore('key', defaultValue)

// 使用（与普通 atom 完全一样）
const [value, setValue] = useAtom(myAtom)

// 可选：手动初始化
useElectronStoreInit(myAtom)

// 缓存控制
const latest = await myAtom.loadFromStore() // 带缓存
const fresh = await myAtom.loadFromStore(true) // 跳过缓存`}
						</pre>
					</div>
					<div>
						<h4 className="font-medium mb-2">专业版本</h4>
						<pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
							{`// 创建 atom
const myAtom = atomWithElectronStorePro('key', defaultValue)

// 使用（需要专用 Hook）
const [value, setValue] = useSyncAtom(myAtom)

// 自动跨窗口同步和初始化

// 缓存控制
const latest = await myAtom.refresh() // 带缓存  
const fresh = await myAtom.refresh(true) // 跳过缓存`}
						</pre>
					</div>
				</div>
			</div>
		</div>
	)
}
