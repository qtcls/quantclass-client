/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export const FAQList: {
	trigger: string
	content: string
}[] = [
	{
		trigger: "预处理数据如何订阅？",
		content:
			"分享会同学在同时订阅现货 1h 数据和合约 1h 数据后，预处理数据会自动订阅；如果订阅列表里没有展示，请重新点击“新增订阅”按钮后，再点击“确认订阅列表”按钮，则可以正常订阅；如果还没有请检查用户权限是否为分享会同学",
	},
	{
		trigger: "预处理数据更新逻辑？",
		content:
			"在每天现货 1h 数据和合约 1h 数据更新后自动调度预处理逻辑，在本地计算、生成预处理数据",
	},
	{
		trigger: "如果预处理数据没有更新、或更新异常怎么办？",
		content:
			"首先检查对应两个数据源是否正常更新，如果正常更新，则检查预处理数据是否正常，如果订阅不正常，则可以点击预处理数据的全量更新，手动触发本地计算逻辑",
	},
	{
		trigger: "运行策略试跑等操作运行导致客户端白屏",
		content:
			"检查自己的 CPU 核心数和内存以及实盘配置的性能模式，然后参考计算公式，(核心数 * 性能模式对应使用核心比例) * 2GB > 内存，如果满足则可以正常运行，否则需要调整配置；Intel 的核心数使用逻辑处理器数量，AMD 的核心数使用内核数量",
	},
	{
		trigger: "如何更新客户端版本",
		content:
			"目前 windows 右下角设置按钮里点击检查更新，会自动下载最新版本，下载完成后会自动安装更新，安装完成后会自动重启客户端",
	},
]
