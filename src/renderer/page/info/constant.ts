/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export const typeIconMap = {
	feat: "🚀",
	fix: "🐛",
	docs: "📚",
	style: "🎨",
	refactor: "🔄",
	perf: "🚀",
	chore: "🧹",
}

export const changelogs = [
	{
		version: "2.1.8",
		changes: [
			{
				type: "fix",
				description:
					"渲染进程请求默认端口号可用时，未覆盖前面自动计算的可用端口号",
			},
		],
	},
	{
		version: "2.1.7",
		changes: [
			{
				type: "feat",
				description: "看板-实盘模块支持切换是否展示资金金额",
			},
			{
				type: "feat",
				description:
					"支持手动刷新资金信息（但注意因为底层并不是连接 qmt 获取，所以默认仍有 1 分钟延迟，且非交易时间无法获取账户信息）",
			},
			{
				type: "feat",
				description: "添加策略交互优化",
			},
			{
				type: "fix",
				description: "渲染进程请求端口号",
			},
		],
	},
	{
		version: "2.1.6",
		changes: [
			{
				type: "feat",
				description: "添加网络状态监听",
			},
			{
				type: "fix",
				description: "并发请求异常",
			},
			{
				type: "fix",
				description: "读取实盘状态，轮询错误",
			},
		],
	},
	{
		version: "2.1.5",
		changes: [
			{
				type: "refactor",
				description: "数据管理模块底层重构",
			},
			{
				type: "fix",
				description: "初始化时间戳类型问题",
			},
		],
	},
	{
		version: "2.1.4",
		changes: [
			{
				type: "feat",
				description: "调整客户端版本更新交互，增加版本内容提示",
			},
			{
				type: "feat",
				description: "日志看板内核输出分流",
			},
			{
				type: "feat",
				description: "添加 rocket 异常挂起的心跳机制通知",
			},
			{
				type: "feat",
				description: "添加 2025 交易日历数据",
			},
			{
				type: "fix",
				description: "分配资金为 0 时的异常显示",
			},
			{
				type: "fix",
				description: "修复状态同步不实时，导致自动启动实盘启动触发校验拦截",
			},
		],
	},
	{
		version: "2.1.3",
		changes: [
			{
				type: "feat",
				description: "新增常见问题解答页面",
			},
			{
				type: "fix",
				description: "主进程同步用户信息方式重构",
			},
			{
				type: "fix",
				description: "实盘自动交易在未启动自动更新时不能启动",
			},
		],
	},
]
