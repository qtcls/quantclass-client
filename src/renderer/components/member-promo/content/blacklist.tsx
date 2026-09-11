/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import blacklist1 from "@/renderer/assets/member-promo/blacklist/1.png"
import blacklist2 from "@/renderer/assets/member-promo/blacklist/2.png"
import {
	MemberPromoFenClassButton,
	MemberPromoTabPanel,
} from "@/renderer/components/member-promo/promo-tab-panel"

export function BlacklistPromoContent() {
	return (
		<MemberPromoTabPanel title="条件黑名单" images={[blacklist1, blacklist2]}>
			<section className="space-y-2">
				<h3 className="font-semibold">一. 什么是条件黑名单</h3>
				<p>
					条件黑名单是我们在实战中发现的一个非常实用的功能，可以有效的帮你规避一些潜在风险股票，或者策略经常选到但不产生收益的个股。由于26分享会旗舰策略凌烟阁是个股日内择时的策略，因此我们还对应开发了条件不买入的功能（目前仅支持根据涨跌幅，之后还会支持更多条件）
				</p>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">二. 条件黑名单使用场景</h3>
				<ul className="list-disc space-y-2 pl-5">
					<li>
						<span className="font-medium">涨幅超过：</span>
						当某只股票下单时当日涨幅超过阈值，哪怕策略选中、择时策略信号为买入，也不对他进行买入。主要用于避免追涨。
					</li>
					<li>
						<span className="font-medium">跌幅超过：</span>
						当某只股票下单时当日跌幅超过阈值，哪怕策略选中、择时策略信号为买入，也不对他进行买入。主要用于避免当夜间或盘中发生利空后的暴跌。
					</li>
					<li>
						<span className="font-medium">振幅超过：</span>
						当某只股票下单时当日振幅【(当日目前最高价-当日目前最低价)/前收盘价 -
						1】超过阈值，哪怕策略选中、择时策略信号为买入，也不对他进行买入。主要用于当股票价格不稳定时的避险。
					</li>
				</ul>
			</section>
			<MemberPromoFenClassButton year={2026} label="26分享会" />
		</MemberPromoTabPanel>
	)
}
