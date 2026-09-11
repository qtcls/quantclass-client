/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import configMaster1 from "@/renderer/assets/member-promo/config-master/1.png"
import configMaster2 from "@/renderer/assets/member-promo/config-master/2.png"
import configMaster3 from "@/renderer/assets/member-promo/config-master/3.png"
import {
	MemberPromoFenClassButton,
	MemberPromoTabPanel,
} from "@/renderer/components/member-promo/promo-tab-panel"

export function ConfigMasterPromoContent() {
	return (
		<MemberPromoTabPanel
			title="Config大师"
			images={[configMaster1, configMaster2, configMaster3]}
		>
			<section className="space-y-2">
				<h3 className="font-semibold">一. 什么是Config大师</h3>
				<p>
					我们经常说要做交易员，把精力放在策略研究上，Config大师就是为方便每位学员研究策略、修改策略配置开发的工具。在这里你不用改代码，点点鼠标就能非常方便的修改策略配置、因子和参数，不用再打开config.py去面对繁多的代码修改了。
				</p>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">二. Config大师可以做什么？</h3>
				<p>
					很多同学说，每次修改都要打开代码，看代码就头疼。这还只是一个策略的，像分享会的精心随机都是混合策略，一个config里包含很多个策略，代码一眼看上去更是眼花缭乱，改个config要半天，现在都可以直接修改：
				</p>
				<ol className="list-decimal space-y-2 pl-5">
					<li>
						<span className="font-medium">策略基础配置：</span>
						策略名称、资金权重、持仓周期、offset、选股数量、换仓时间；
					</li>
					<li>
						<span className="font-medium">因子配置：</span>
						排序因子、过滤因子，都可以直接添加、删除，修改参数、使用条件、排序方式；
					</li>
					<li>
						<span className="font-medium">择时因子：</span>
						选择具体的择时策略（如：定风波1.5、凌烟阁2），以及凌烟阁个股择时的具体指标参数、权重、周期等...
					</li>
					<li>
						<span className="font-medium">运行配置：</span>
						存放路径、时间配置、交易配置、性能等...
					</li>
				</ol>
				<p>
					这些现在通通都可以直接在config大师里，用图形界面一目了然的看到并进行修改。
				</p>
				<p>最后，当你开发完策略还可以一键导出至客户端实盘，非常方便~</p>
			</section>
			<MemberPromoFenClassButton year={2026} label="26分享会" />
		</MemberPromoTabPanel>
	)
}
