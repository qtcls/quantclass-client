import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { AppVersions } from "@/shared/types/version"

const { checkUpdate } = window.electronAPI

// 版本查询的通用配置
const VERSION_QUERY_CONFIG = {
	// 远程版本查询配置
	REMOTE: {
		REFETCH_INTERVAL: 1000 * 60 * 30, // 30分钟重新请求一次
		STALE_TIME: 1000 * 60 * 15, // 15分钟内数据被认为是新鲜的
		RETRY: 3, // 失败重试3次
		RETRY_DELAY: 2000, // 重试延迟2秒
	},
} as const

/**
 * 检查远程版本更新
 * @param options - 可选的 React Query 配置覆盖
 * @returns 远程版本信息和相关状态
 */
export const useAppVersions = (
	options?: Partial<UseQueryOptions<AppVersions, Error>>,
) => {
	const {
		data: appVersions,
		isLoading: isCheckingAppVersions,
		refetch: refetchAppVersions,
	} = useQuery({
		queryKey: ["app-versions"],
		queryFn: async () => {
			try {
				return await checkUpdate()
			} catch (error) {
				console.error("检查远程版本失败:", error)
				throw error
			}
		},
		enabled: true,
		refetchInterval: VERSION_QUERY_CONFIG.REMOTE.REFETCH_INTERVAL,
		staleTime: VERSION_QUERY_CONFIG.REMOTE.STALE_TIME,
		retry: VERSION_QUERY_CONFIG.REMOTE.RETRY,
		retryDelay: VERSION_QUERY_CONFIG.REMOTE.RETRY_DELAY,
		// // 网络重连时自动重新获取
		refetchOnReconnect: true,
		// // 窗口重新获得焦点时重新获取
		refetchOnWindowFocus: false,
		...options,
	})

	return {
		appVersions,
		isCheckingAppVersions,
		refetchAppVersions,
	}
}
