/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

// src/renderer/utils/store.ts
import { atom, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback, useEffect } from "react"

const { getStoreValue, setStoreValue } = window.electronAPI

// ============================================================================
// 💾 缓存机制
// ============================================================================

// 存储值缓存，避免重复 IPC 调用
const storeCache = new Map<string, { value: any; timestamp: number }>()

// 缓存有效期（毫秒）
const CACHE_TTL = 1500 // 1.5秒

/**
 * 带缓存的 getStoreValue
 */
async function getCachedStoreValue<T>(
	key: string,
	defaultValue: T,
	force = false,
): Promise<T> {
	const now = Date.now()
	const cached = storeCache.get(key)

	// 如果不强制刷新，且缓存存在且未过期，直接返回缓存值
	if (!force && cached && now - cached.timestamp < CACHE_TTL) {
		return cached.value as T
	}

	// 否则从 Electron Store 获取最新值
	try {
		const value = await getStoreValue(key, defaultValue)
		console.log("IPC:getStoreValue", key, value)

		// 更新缓存
		storeCache.set(key, { value, timestamp: now })

		return value as T
	} catch (error) {
		console.warn(`Failed to get store value for key "${key}":`, error)
		return defaultValue
	}
}

/**
 * 清除指定 key 的缓存
 */
function clearStoreCache(key: string) {
	storeCache.delete(key)
}

/**
 * 清除所有缓存
 */
function clearAllStoreCache() {
	storeCache.clear()
}

// ============================================================================
// 🚀 简化版本：atomWithElectronStore
// 特点：简单、快速、直接使用 useAtom
// ============================================================================

export interface ElectronStoreOptions {
	/**
	 * 是否同时保存到 localStorage
	 * @default false
	 */
	useLocalStorage?: boolean

	/**
	 * 是否在初始化时从存储加载值
	 * @default true
	 */
	getOnInit?: boolean
}

/**
 * 🚀 简化版本：创建一个与 Electron Store 同步的 atom
 * 特点：简单、直接、适合大多数场景
 *
 * 数据流：内存 -> localStorage (可选) -> Electron Store
 * 使用方式：直接用 useAtom(atomWithElectronStore(...))
 *
 * @param key 存储键名
 * @param defaultValue 默认值
 * @param options 配置选项
 * @returns Jotai atom (可直接用于 useAtom)
 *
 * @example
 * ```ts
 * // 基础用法
 * const userAtom = atomWithElectronStore('user', { name: '', id: '' })
 * const [user, setUser] = useAtom(userAtom)
 *
 * // 支持 localStorage + Electron Store
 * const configAtom = atomWithElectronStore('config', {}, { useLocalStorage: true })
 * ```
 */
export function atomWithElectronStore<T>(
	key: string,
	defaultValue: T,
	options: ElectronStoreOptions = {},
) {
	const { useLocalStorage = false, getOnInit = true } = options

	// 基础 atom：选择 localStorage 或纯内存
	const baseAtom = useLocalStorage
		? atomWithStorage(key, defaultValue, undefined, { getOnInit })
		: atom(defaultValue)

	// 初始化：从 Electron Store 加载值
	if (getOnInit) {
		// 异步初始化，不阻塞 atom 创建
		getCachedStoreValue(key, defaultValue)
			.then((_electronValue) => {
				// 由于无法在这里直接更新 atom，实际的初始化会在组件中进行
				// 这里只是预热缓存
			})
			.catch((error) => {
				console.warn(
					`Failed to preload from Electron Store for key "${key}":`,
					error,
				)
			})
	}

	// 创建同步 atom
	const syncAtom = atom(
		// getter: 读取当前值
		(get) => get(baseAtom),

		// setter: 更新值并同步到 Electron Store
		(get, set, update: T | ((prev: T) => T)) => {
			const prevValue = get(baseAtom)
			const nextValue =
				typeof update === "function"
					? (update as (prev: T) => T)(prevValue)
					: update

			// 1. 更新内存中的值（如果启用了 localStorage 也会同步）
			set(baseAtom, nextValue)

			// 2. 异步同步到 Electron Store（不阻塞 UI）
			setStoreValue(key, nextValue)
				.then(() => {
					// 更新缓存，确保后续 loadFromStore 能立即获取到最新值
					storeCache.set(key, { value: nextValue, timestamp: Date.now() })
				})
				.catch((error) => {
					console.error(
						`Failed to sync to Electron Store for key "${key}":`,
						error,
					)
				})
		},
	)

	// 添加工具方法
	Object.assign(syncAtom, {
		key,
		useLocalStorage,
		/**
		 * 从 Electron Store 加载最新值
		 * @param force 是否强制跳过缓存，默认 false
		 */
		loadFromStore: async (force = false): Promise<T> => {
			return getCachedStoreValue(key, defaultValue, force)
		},
	})

	return syncAtom
}

// ============================================================================
// 🏆 专业版本：atomWithElectronStorePro
// 特点：跨窗口同步、自动初始化、监听器管理
// ============================================================================

// 跨窗口监听器管理
const crossWindowListeners = new Map<string, Set<(value: any) => void>>()

export interface ElectronStoreProOptions extends ElectronStoreOptions {
	/**
	 * 是否启用跨窗口同步
	 * @default true
	 */
	enableCrossWindow?: boolean

	/**
	 * 跨窗口同步的检查间隔（毫秒）
	 * 仅在不支持 IPC 事件时使用轮询
	 * @default 1000
	 */
	crossWindowInterval?: number
}

/**
 * 🏆 专业版本：创建一个增强的 Electron Store atom
 * 特点：跨窗口同步、自动初始化、错误处理、监听器管理
 *
 * 适用场景：
 * - 多窗口应用需要数据同步
 * - 需要监听外部数据变化
 * - 需要完整的错误处理和日志
 *
 * @param key 存储键名
 * @param defaultValue 默认值
 * @param options 配置选项
 * @returns 增强的 atom (推荐配合 useSyncAtom 使用)
 *
 * @example
 * ```ts
 * // 专业版本 + 高级 Hook
 * const userAtom = atomWithElectronStorePro('user', { name: '', id: '' })
 * const [user, setUser] = useSyncAtom(userAtom)
 *
 * // 带跨窗口同步
 * const configAtom = atomWithElectronStorePro('config', {}, {
 *   useLocalStorage: true,
 *   enableCrossWindow: true
 * })
 * ```
 */
export function atomWithElectronStorePro<T>(
	key: string,
	defaultValue: T,
	options: ElectronStoreProOptions = {},
) {
	const {
		useLocalStorage = false,
		getOnInit = true,
		enableCrossWindow = true,
	} = options

	// 基础 atom
	const baseAtom = useLocalStorage
		? atomWithStorage(key, defaultValue, undefined, { getOnInit })
		: atom(defaultValue)

	// 异步从 Electron Store 加载初始值
	const loadFromElectronStore = async (force = false): Promise<T> => {
		if (!getOnInit) return defaultValue
		return getCachedStoreValue(key, defaultValue, force)
	}

	// 同步到 Electron Store 并通知跨窗口监听器
	const syncToElectronStore = async (value: T) => {
		try {
			await setStoreValue(key, value)

			// 更新缓存
			storeCache.set(key, { value, timestamp: Date.now() })

			// 跨窗口通知
			if (enableCrossWindow) {
				const listeners = crossWindowListeners.get(key)
				if (listeners) {
					for (const listener of listeners) {
						try {
							listener(value)
						} catch (error) {
							console.warn(
								`Error in cross-window listener for key "${key}":`,
								error,
							)
						}
					}
				}
			}
		} catch (error) {
			console.error(`Failed to sync to Electron Store for key "${key}":`, error)
		}
	}

	// 创建派生 atom
	const derivedAtom = atom(
		(get) => get(baseAtom),
		(get, set, update: T | ((prev: T) => T)) => {
			const prevValue = get(baseAtom)
			const nextValue =
				typeof update === "function"
					? (update as (prev: T) => T)(prevValue)
					: update

			set(baseAtom, nextValue)
			syncToElectronStore(nextValue)
		},
	)

	// 扩展方法
	const enhancedAtom = Object.assign(derivedAtom, {
		key,
		useLocalStorage,
		enableCrossWindow,

		/**
		 * 从 Electron Store 刷新值
		 * @param force 是否强制跳过缓存，默认 false
		 */
		refresh: loadFromElectronStore,

		/**
		 * 添加跨窗口变化监听器
		 */
		subscribe: (listener: (value: T) => void) => {
			if (!enableCrossWindow) {
				console.warn(`Cross-window sync is disabled for key "${key}"`)
				return () => {}
			}

			if (!crossWindowListeners.has(key)) {
				crossWindowListeners.set(key, new Set())
			}

			const listeners = crossWindowListeners.get(key)!
			listeners.add(listener)

			return () => {
				listeners.delete(listener)
				if (listeners.size === 0) {
					crossWindowListeners.delete(key)
				}
			}
		},

		/**
		 * 手动同步值到 Electron Store
		 */
		forceSync: (value: T) => {
			syncToElectronStore(value)
		},
	})

	return enhancedAtom
}

// ============================================================================
// 🔧 高级 Hook：useSyncAtom
// 特点：自动初始化、跨窗口监听、优雅的 API
// ============================================================================

/**
 * 🔧 高级 Hook：用于专业版 atom 的自动同步管理
 *
 * 功能：
 * - 自动从 Electron Store 初始化值
 * - 监听跨窗口数据变化
 * - 提供与 useAtom 相同的 API
 *
 * @param storeAtom atomWithElectronStorePro 创建的 atom
 * @param onStoreChange 可选的变化回调
 * @returns [value, setter] 与 useAtom 相同的接口
 *
 * @example
 * ```ts
 * // 基础用法
 * const userAtom = atomWithElectronStorePro('user', { name: '', id: '' })
 * const [user, setUser] = useSyncAtom(userAtom)
 *
 * // 带变化监听
 * const [config, setConfig] = useSyncAtom(configAtom, (newConfig) => {
 *   console.log('配置已更新:', newConfig)
 * })
 * ```
 */
export function useSyncAtom<T>(
	storeAtom: ReturnType<typeof atomWithElectronStorePro<T>>,
	onStoreChange?: (value: T) => void,
) {
	const { useEffect, useCallback } = require("react")
	const { useAtom } = require("jotai")

	const [value, setValue] = useAtom(storeAtom)

	// 初始化时从 Electron Store 加载值
	useEffect(() => {
		storeAtom.refresh().then((electronValue) => {
			if (JSON.stringify(electronValue) !== JSON.stringify(value)) {
				setValue(electronValue)
			}
		})
	}, []) // 只在组件挂载时执行一次

	// 监听其他地方对 Electron Store 的修改（跨窗口同步）
	useEffect(() => {
		if (!storeAtom.enableCrossWindow) return

		const unsubscribe = storeAtom.subscribe((newValue) => {
			setValue(newValue)
			onStoreChange?.(newValue)
		})

		return unsubscribe
	}, [storeAtom, setValue, onStoreChange])

	// 返回同步的 setter
	const syncedSetter = useCallback(
		(update: T | ((prev: T) => T)) => {
			setValue(update)
		},
		[setValue],
	)

	return [value, syncedSetter] as const
}

// ============================================================================
// 🎯 手动初始化 Hook：useElectronStoreInit
// 特点：为简化版本提供手动初始化能力
// ============================================================================

/**
 * 🎯 手动初始化 Hook：为简化版本提供初始化功能
 *
 * 用途：配合 atomWithElectronStore 使用，手动控制初始化时机
 *
 * @param storeAtom atomWithElectronStore 创建的 atom
 * @param shouldAutoInit 是否自动初始化，默认 true
 *
 * @example
 * ```ts
 * const userAtom = atomWithElectronStore('user', { name: '', id: '' })
 * const [user, setUser] = useAtom(userAtom)
 *
 * // 手动初始化
 * useElectronStoreInit(userAtom)
 *
 * // 条件初始化
 * useElectronStoreInit(userAtom, user.id === '') // 只在用户未登录时初始化
 * ```
 */
export function useElectronStoreInit<T>(
	storeAtom: ElectronStoreAtom<T>,
	onInitSuccess?: () => void,
	shouldAutoInit = true,
) {
	const setAtomValue = useSetAtom(storeAtom)

	useEffect(() => {
		if (!shouldAutoInit) return
		;(storeAtom as any)
			.loadFromStore()
			.then((electronValue: T) => {
				setAtomValue(electronValue)
				onInitSuccess?.()
			})
			.catch((error: Error) => {
				console.warn("Failed to initialize from Electron Store:", error)
			})
	}, [storeAtom, setAtomValue, shouldAutoInit])
}

// ============================================================================
// 🔄 Reload Hook：强制重新加载功能
// ============================================================================

/**
 * 🔄 强制重新加载 atom 的值（跳过缓存，直接从 Electron Store 获取）
 *
 * @param storeAtom - 要重载的 atom
 * @param onReloadSuccess - 重载成功后的回调
 *
 * @example
 * ```ts
 * const settingsAtom = atomWithElectronStore('settings', {})
 * const [settings, setSettings] = useAtom(settingsAtom)
 * const reloadSettings = useStoreReload(settingsAtom)
 *
 * // 强制重新加载
 * const handleReload = async () => {
 *   await reloadSettings()
 * }
 * ```
 */
export function useStoreReload<T>(
	storeAtom: ElectronStoreAtom<T>,
	onReloadSuccess?: (value: T) => void,
) {
	const setAtomValue = useSetAtom(storeAtom)

	const reload = useCallback(async (): Promise<T> => {
		try {
			// 获取 atom 的 key
			const key = (storeAtom as any).key
			if (!key) {
				throw new Error(
					"无法获取 store key，请确保使用 atomWithElectronStore 创建的 atom",
				)
			}

			// 强制从 Electron Store 获取最新值（force = true，跳过缓存）
			const freshValue = await getCachedStoreValue(
				key,
				(storeAtom as any).init || null,
				true,
			)

			console.log(`[useStoreReload] 强制重载 ${key}:`, freshValue)

			// 更新 atom 值
			setAtomValue(freshValue)

			// 调用成功回调
			onReloadSuccess?.(freshValue)

			return freshValue as T
		} catch (error) {
			console.error("[useStoreReload] 重载失败:", error)
			throw error
		}
	}, [storeAtom, setAtomValue, onReloadSuccess])

	return reload
}

/**
 * 🔄 批量重新加载多个 atom 的值
 *
 * @param atoms - 要重载的 atom 数组
 *
 * @example
 * ```ts
 * const reloadAll = useStoreReloadBatch([settingsAtom, dataSubscribedAtom])
 *
 * // 批量重新加载
 * const handleReloadAll = async () => {
 *   await reloadAll()
 * }
 * ```
 */
export function useStoreReloadBatch(atoms: ElectronStoreAtom<any>[]) {
	const reloadFunctions = atoms.map((atom) => useStoreReload(atom))

	const reloadAll = useCallback(async () => {
		try {
			console.log("[useStoreReloadBatch] 开始批量重载...")

			// 并行执行所有重载操作
			const results = await Promise.all(
				reloadFunctions.map((reload, index) =>
					reload().catch((error) => {
						console.warn(
							`[useStoreReloadBatch] atom[${index}] 重载失败:`,
							error,
						)
						return null
					}),
				),
			)

			console.log("[useStoreReloadBatch] 批量重载完成:", results)
			return results
		} catch (error) {
			console.error("[useStoreReloadBatch] 批量重载失败:", error)
			throw error
		}
	}, [reloadFunctions])

	return reloadAll
}

// ============================================================================
// 📤 类型导出
// ============================================================================

export type ElectronStoreAtom<T> = ReturnType<typeof atomWithElectronStore<T>>
export type ElectronStoreProAtom<T> = ReturnType<
	typeof atomWithElectronStorePro<T>
>

// ============================================================================
// 🔍 调试和工具函数
// ============================================================================

/**
 * 🔍 检查 Electron Store 连接状态
 */
export function checkElectronStoreConnection(): boolean {
	return (
		window.electronAPI && typeof window.electronAPI.getStoreValue === "function"
	)
}

/**
 * 📊 获取所有活跃的跨窗口监听器统计
 */
export function getCrossWindowListenerStats() {
	const stats = new Map<string, number>()
	for (const [key, listeners] of crossWindowListeners) {
		stats.set(key, listeners.size)
	}
	return Object.fromEntries(stats)
}

/**
 * 🧹 缓存管理工具
 */
export const cacheUtils = {
	/**
	 * 获取缓存统计信息
	 */
	getStats() {
		const now = Date.now()
		const stats: Array<{ key: string; age: number; expired: boolean }> = []

		for (const [key, cached] of storeCache) {
			const age = now - cached.timestamp
			stats.push({
				key,
				age,
				expired: age >= CACHE_TTL,
			})
		}

		return stats
	},

	/**
	 * 清除指定 key 的缓存
	 */
	clear: clearStoreCache,

	/**
	 * 清除所有缓存
	 */
	clearAll: clearAllStoreCache,

	/**
	 * 清除过期缓存
	 */
	clearExpired() {
		const now = Date.now()
		for (const [key, cached] of storeCache) {
			if (now - cached.timestamp >= CACHE_TTL) {
				storeCache.delete(key)
			}
		}
	},

	/**
	 * 获取缓存大小
	 */
	getSize() {
		return storeCache.size
	},

	/**
	 * 设置缓存 TTL（毫秒）
	 */
	setCacheTTL(_ttl: number) {
		// 注意：这会影响全局 TTL，需要重新定义 CACHE_TTL 为可变的
		console.warn("setCacheTTL: 当前实现中 TTL 是常量，需要重构以支持动态设置")
	},
}
