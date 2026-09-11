/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import {
	MemberPromoFenClassButton,
	MemberPromoTabPanel,
} from "@/renderer/components/member-promo/promo-tab-panel"

export function ExclusivePromoContent() {
	return (
		<MemberPromoTabPanel title="分享会策略专属功能">
			<section className="space-y-2">
				<h3 className="font-semibold">一. 分享会策略专属功能介绍</h3>
				<p>条件黑名单</p>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">二. 后置过滤因子</h3>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">三. 截面因子</h3>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">四. 个股择时因子</h3>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">五. 择时开仓/离场因子</h3>
			</section>

			<section className="mt-5 space-y-2">
				<h3 className="font-semibold">六. 换仓时间点</h3>
			</section>

			<MemberPromoFenClassButton year={2026} label="26分享会" />
		</MemberPromoTabPanel>
	)
}
