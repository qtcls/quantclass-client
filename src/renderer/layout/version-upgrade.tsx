/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { Button } from "@/renderer/components/ui/button"
import { versionListAtom } from "@/renderer/store/storage"
import { useAtom } from "jotai"
import {
	ArrowRight,
	ChevronRight,
	CircleCheckBig,
	Sparkles,
} from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog"
import { useMemo } from "react"
export default function VersionUpgrade() {
	const [versionList, setVersionList] = useAtom(versionListAtom)
	const data = [
		{
			version: "3.4.0",
			versionTipsList: [
				{
					title: "🚫 添加实盘买入黑名单功能",
					describe:
						"支持在实盘页面，添加买入黑名单，避免策略在实盘时，买入黑名单中的股票。可以在交易前进行实时配置干预。",
				},
				{
					title: "⏱️ 支持配置定风波择时的fallback仓位",
					describe:
						"当定风波计算超时的时候，可以设定一个默认数值给默认仓位，可以实现超时全量出击，超时不出击，甚至半仓出击的配置",
				},
				{
					title: "🐛 修复了一些小问题",
					describe:
						"比如微信扫码在暗黑模式下扫不出来，并优化了数据订阅页面的所有逻辑",
				},
				{
					title: "🎨 UI细节优化",
					describe: "重构了部分UI细节，优化使用体验",
				},
			],
		},
		{
			version: "3.3.1",
			versionTipsList: [
				{
					title: "🐛 修复3.3.0中换仓随机时间的问题",
					describe:
						"修复换仓时间中随机时间生成的问题，会有一定几率无法被rocket识别，更新后重新保存一下策略（比如调整比例）即可生效。",
				},
			],
		},
		{
			version: "3.3.0",
			versionTipsList: [
				{
					title: "🍁 支持策略增量导入",
					describe:
						"支持从选股回测框架、仓位管理框架、fusion等框架中，增量导入策略",
				},
				{
					title: "⏱️ 支持定时运行配置",
					describe: "包括设置数据更新的时间，选股的时间，以及实盘的时间",
				},
				{
					title: "✏️ 支持编辑更多策略细节",
					describe: "支持策略更多实盘细节编辑，比如实盘的拆单金额等",
				},
				{
					title: "🚤 Fuel内核优化",
					describe: "优化fuel内核执行效率，优化磁盘使用",
				},
				{
					title: "🐛 修复多进程锁在部分电脑上失效的问题",
					describe: "修复多进程锁遇到encoding的问题，导致进程锁失效",
				},
				{
					title: "🔄 换仓时间调整",
					describe:
						"保持仓位管理策略内换仓时间统一，避免出现策略内换仓时间不统一的问题",
				},
			],
		},
		{
			version: "3.2.2",
			versionTipsList: [
				{
					title: "🐛 修复仓位管理策略问题",
					describe: "处理了仓位管理策略自定义参数不生效的问题",
				},
			],
		},
		{
			version: "3.2.1",
			versionTipsList: [
				{
					title: "🐛 修复策略库导入问题",
					describe: "修复小问题，并且支持带默认仓位参数的定风波策略导入",
				},
			],
		},
		{
			version: "3.2.0",
			versionTipsList: [
				{
					title: "🚀 全新仓位管理实盘功能",
					describe:
						"新增仓位管理策略的实盘交易支持，大幅优化策略内核执行效率，完善多策略智能切换机制，为您提供更灵活的交易体验",
				},
				{
					title: "🔄 优化换仓周期设置",
					describe: "取消了尾盘换仓，需要尾盘换仓可以使用换仓时间来进行设置",
				},
				{
					title: "⚡ 系统优化与问题修复",
					describe: "全面优化页面交互逻辑，提升系统稳定性，改进用户操作体验",
				},
			],
		},
		{
			version: "3.1.3",
			versionTipsList: [
				{
					title: "🧹 清理缓存",
					describe: "自动删除客户端运行时产生的缓存文件，释放磁盘空间.",
				},
				{
					title: "🛠️ 修复已知问题",
					describe: "修复回测页面设置过滤，修复偶尔不能编辑策略.",
				},
			],
		},
		{
			version: "3.1.2",
			versionTipsList: [
				{
					title: "📈 支持北交所的过滤",
					describe: "可以选择是否过滤北交所.",
				},
				{
					title: "⚙️ 优化调度的显示逻辑",
					describe: "清晰的呈现内核运行的每一个环节.",
				},
				{
					title: "↗️ 优化升级管理",
					describe:
						"在内核更新时，增加显著的交互提示，清晰知晓当前正处于更新状态.",
				},
				{
					title: "📝 数据订阅页面更新",
					describe:
						"在数据订阅页面新增了'数据订阅名词解释'和'数据更新逻辑'两部分说明，快速掌握数据更新的关键信息.",
				},
				{
					title: "🔧 修复已知问题",
					describe:
						"修复数据订阅列表，确保1小时实时更新数据的显示时间准确无误.",
				},
			],
		},
	]

	const isShow = useMemo(() => {
		return !versionList.includes(data[0].version)
	}, [versionList])
	// 筛选出 data 中 version 不在 versionList 里的数据
	const newData = data.filter((v) => !versionList.includes(v.version))
	return (
		<div>
			<Dialog
				open={isShow}
				onOpenChange={(value) => {
					if (!value) {
						setVersionList(data.map((item) => item.version))
					}
				}}
			>
				<DialogContent className="p-0 max-w-4xl gap-0">
					<DialogHeader className="p-4">
						<DialogTitle>客户端更新日志</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 overflow-y-auto max-h-[70vh] border-y py-4 px-4">
						{newData.slice(0, 10).map((item, index) => (
							<div className="space-y-2" key={index}>
								<div className="flex items-center gap-3">
									<Sparkles
										size={20}
										className="text-yellow-500 dark:text-yellow-300"
									/>
									<span className="text-xl font-semibold">
										{item.version}版本的新功能
									</span>
								</div>
								<div className="space-y-3">
									{item.versionTipsList.map((tipsItem, tipsIndex) => (
										<div className="flex items-center gap-3" key={tipsIndex}>
											<CircleCheckBig size={32} className="max-w-5" />
											<div className="space-y-1">
												<div className="text-sm font-bold">
													{tipsItem.title}
												</div>
												<div className="text-xs text-muted-foreground">
													{tipsItem.describe}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
						{data.filter((v) => !versionList.includes(v.version)).length >
							10 && (
							<div className="flex items-center text-gray-500 justify-center text-sm">
								<span>查看完整版本更新记录</span>
								<ArrowRight className="size-4" />
							</div>
						)}
					</div>
					<div className="text-center p-3">
						<Button
							className="line-height-1"
							onClick={() => {
								// 将 data 中的所有版本号存入 versionList
								const newVersionList = data.map((item) => item.version)
								setVersionList(newVersionList)
							}}
						>
							继续 <ChevronRight size={18} />
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
