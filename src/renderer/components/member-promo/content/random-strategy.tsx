/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import randomStrategy1 from "@/renderer/assets/member-promo/random-strategy/1.png"
import randomStrategy2 from "@/renderer/assets/member-promo/random-strategy/2.png"
import randomStrategy3 from "@/renderer/assets/member-promo/random-strategy/3.png"
import {
	MemberPromoFenClassButton,
	MemberPromoTabPanel,
} from "@/renderer/components/member-promo/promo-tab-panel"
import { memberPromoMutedTextClassName } from "@/renderer/components/member-promo/theme"

function DetailItem({
	label,
	description,
	example,
}: {
	label: string
	description: string
	example: string
}) {
	return (
		<div className="space-y-0.5">
			<p>
				<span className="font-medium">{label}：</span>
				{description}
			</p>
			<p className={memberPromoMutedTextClassName}>（{example}）</p>
		</div>
	)
}

export function RandomStrategyPromoContent() {
	return (
		<MemberPromoTabPanel
			title="精心随机策略库"
			images={[randomStrategy1, randomStrategy2, randomStrategy3]}
		>
			<section className="space-y-2">
				<h3 className="font-semibold">一. 什么是精心随机</h3>
				<p>
					精心随机是为每位学员生成的、在合理参数范围内随机组合的策略版本。目的是：
				</p>
				<ol className="list-decimal space-y-1 pl-5">
					<li>
						<span className="font-medium">快速体验策略：</span>
						学员下载config文件后可直接投入实盘，无需调整参数。
					</li>
					<li>
						<span className="font-medium">防止策略拥挤：</span>
						确保不同学员的策略在细节上有所差异，避免集体交易同一标的导致收益下降。
					</li>
				</ol>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">二. 精心随机的细节与参数逻辑</h3>
				<div className="space-y-3">
					<DetailItem
						label="策略池随机"
						description="从一个策略池中随机选择若干子策略。"
						example="如从小市值策略池中随机选3个"
					/>
					<DetailItem
						label="策略细节随机"
						description="同一策略的不同方向或配置随机分配。"
						example="如中等生轮动指数随机分配"
					/>
					<DetailItem
						label="参数随机"
						description="在“好的参数平原”内随机选取，并注意大小搭配。"
						example="避免单压全是大参数或全是小参数"
					/>
					<DetailItem
						label="Offset覆盖随机"
						description="下单的交易日随机分布。"
						example="如周一至三、周四至二等"
					/>
					<DetailItem
						label="分钟偏移随机"
						description="币圈策略的下单时间点在整点基础上进行随机偏移。"
						example="如偏移5分钟、15分钟等"
					/>
				</div>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">三. 关于精心随机的重要提示！</h3>
				<p>
					不建议为了“回测结果最好”而多次下载挑选。回测好坏不代表未来表现，且经验表明，学员自己魔改的策略常常跑不过精心随机（存在过拟合风险），将“命运交给风”。
				</p>
				<p>
					精心随机的核心目的是让学员在实盘运行中观察和理解策略特性（如涨跌规律、offset、rebalance等），为后续的参数调整和策略理解打下基础。
				</p>
			</section>
			<MemberPromoFenClassButton year={2026} label="26分享会" />
		</MemberPromoTabPanel>
	)
}
