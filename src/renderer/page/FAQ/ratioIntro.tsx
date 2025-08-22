/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

export const RatioIntro = () => {
	return (
		<div className="leading-loose text-sm text-muted-foreground">
			<h3 className="font-bold text-lg text-accent-foreground">
				# 资金占比说明
			</h3>
			<div className="mb-2">
				在计算资金占比时，我们是以{" "}
				<span className="font-bold text-accent-foreground">整体账户资金</span>{" "}
				为基数进行计算，而不仅仅是考虑可用资金。整体账户资金包括{" "}
				<span className="underline">两部分</span>： <br />
				<ul className="list-disc list-inside">
					<li>
						<span className="font-semibold">可用资金</span>
						：指的是您账户中当前可以直接用于交易的现金余额。
					</li>
					<li>
						<span className="font-semibold">持仓市值</span>
						：即您当前持有的所有未平仓仓位的市值，也会被计入整体资金中。
					</li>
				</ul>
				当然，我们多次反复强调，不建议使用带有“手动持仓”的账户进行自动化实盘交易。
			</div>
			<div className="mb-2">
				<h3 className="font-bold">## 案例1</h3>
				<ul className="list-disc list-inside">
					<li>
						<span className="font-semibold">账户总资产</span>
						：100,000元
					</li>
					<li>
						<span className="font-semibold">目标资金分配</span>
						：10,000元
					</li>
				</ul>
				<p>
					在这种情况下，所有策略占比加总的“资金占比”为{" "}
					<span className="font-bold text-accent-foreground">10%</span>。
				</p>
			</div>
			<div className="mb-2">
				<h3 className="font-bold">## 案例2：包含自己的持仓</h3>
				<p className="text-warning">
					（非常不建议，需要复习客户端使用的相关直播）
				</p>
				<ul className="list-disc list-inside">
					<li>
						<span className="font-semibold">账户总资产</span>
						：100,000元
					</li>
					<li>
						<span className="font-semibold">当前自己的持仓</span>
						：80,000元
					</li>
					<li>
						<span className="font-semibold">目标资金分配</span>
						：持仓之外的可用资金
					</li>
				</ul>
				<p>
					在这种情况下，所有策略占比加总的“资金占比”为{" "}
					<span className="font-bold text-accent-foreground">20%</span>。
				</p>
			</div>
		</div>
	)
}
