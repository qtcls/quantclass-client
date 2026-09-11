/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import fusionLibrary1 from "@/renderer/assets/member-promo/fusion-library/1.png"
import {
	MemberPromoFenClassButton,
	MemberPromoTabPanel,
} from "@/renderer/components/member-promo/promo-tab-panel"

export function FusionLibraryPromoContent() {
	return (
		<MemberPromoTabPanel title="综合策略库" images={[fusionLibrary1]}>
			<section className="space-y-2">
				<h3 className="font-semibold">一. 综合策略库介绍</h3>
				<p>
					综合策略库是为了满足参与2年及以上的分享会同学，可以帮助其同时管理和实盘多年分享会旗舰策略的特殊策略库，在这里可以非常方便的分配每个策略分配的资金，以及对策略进行修改
				</p>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">二. 风火轮策略</h3>
				<p>
					风火轮是24分享会的旗舰策略，是根据指数轮动策略的原理，结合策略就是指数的思想开发的轮动策略。
					全年经过风火轮1→风火轮2→风火轮3的迭代升级，可以做到进可攻、退可守。
					风火轮3在25、26年样本外表现惊艳，26年5月引入白马抱团策略进一步升级，策略自24年8月介绍至26年8月，正好两年实现翻倍。
				</p>
				<MemberPromoFenClassButton year={2024} label="24分享会" />
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">三. 选股精心随机混合</h3>
				<p>
					选股精心随机混合是25分享会推出的精心随机策略，采用了不同策略类型混合可以实现风格覆盖、此消彼长、各领风骚的原理，可以大大降低单一策略的大幅回撤的问题。在此基础上还可以对每个选股策略配置不同的定风波择时，进一步降低策略回撤。
					定风波择时是25分享会的旗舰策略，可以对策略进行择时，判定开仓/离场并执行。全年经过定风波1→定风波1p5→定风波2→定风波3的迭代升级，可以做到超强的回撤控制效果，让你的策略稳步增长，远离回撤后那失眠的漫漫长夜~
				</p>
				<MemberPromoFenClassButton year={2025} label="25分享会" />
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">四. 选股策略精心随机</h3>
				<p>
					选股策略精心随机是26分享会推出的精心随机策略，专为26分享会旗舰策略凌烟阁定制。区分策略的类型（小市值类、中市值类、大市值类），独立配置适合的个股择时方案。实操时也能再结合策略类型混合理念。
					凌烟阁是26分享会的旗舰策略，可以对策略内个股进行择时，根据市场行情，自动为你匹配合适的择时策略，无论市场走到哪个周期、哪个阶段，都有对应的策略帮你自动判断进场、出场时机并执行。
					全年经过凌烟阁1→凌烟阁1.2→凌烟阁2的迭代升级，拥有丰富的策略库，可以覆盖各种风格。全天候策略，省心省力，再也不用天天盯盘。
					别看迭代版本相对风火轮、定风波少，实则为策略开发广度和深度巨大，且参数平原极度宽广，策略超额长期显著，底层逻辑坚硬扎实。
				</p>
				<MemberPromoFenClassButton year={2026} label="26分享会" />
			</section>
		</MemberPromoTabPanel>
	)
}
