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
	BACK_TEST_PAGE as BACKTEST_PAGE,
	CHANGE_LOGS_PAGE,
	DATA_PAGE,
	FAQ_PAGE,
	HOME_PAGE,
	POSITION_INFO_PAGE,
	POSITION_STRATEGY_LIBRARY_PAGE,
	REAL_MARKET_CONFIG_PAGE,
	STRATEGY_LIBRARY_PAGE,
	STRATEGY_PAGE,
	TRADING_PLAN_PAGE,
} from "@/renderer/constant"
import FAQ from "@/renderer/page/FAQ"
import StrategyRun from "@/renderer/page/backtest"
import Data from "@/renderer/page/data"
import Home from "@/renderer/page/home"
import ChangeLogs from "@/renderer/page/info"
import StrategyLibrary from "@/renderer/page/library"
import FusionStrategyLibrary from "@/renderer/page/library/fusion"
import PositionInfo from "@/renderer/page/position"
import StrategySubscription from "@/renderer/page/subscription"
import TradingPlan from "@/renderer/page/trading/plan"
import { ListBulletIcon } from "@radix-ui/react-icons"

import {
	BarChartIcon,
	DatabaseIcon,
	HelpCircleIcon,
	HistoryIcon,
	HomeIcon,
	LayoutGrid,
	LibraryIcon,
	WeightIcon,
} from "lucide-react"
import TradingPage from "../page/trading"

export const ROUTES = [
	{
		key: HOME_PAGE,
		icon: HomeIcon,
		label: "首页",
		element: Home,
	},
	{
		key: DATA_PAGE,
		icon: DatabaseIcon,
		label: "数据订阅",
		element: Data,
	},
	{
		key: STRATEGY_PAGE,
		icon: BarChartIcon,
		label: "策略订阅",
		element: StrategySubscription,
	},
	{
		key: STRATEGY_LIBRARY_PAGE,
		icon: LibraryIcon,
		label: "选股策略",
		element: StrategyLibrary,
	},
	{
		key: POSITION_STRATEGY_LIBRARY_PAGE,
		icon: LibraryIcon,
		label: "综合策略库",
		element: FusionStrategyLibrary,
	},
	{
		key: BACKTEST_PAGE,
		icon: LayoutGrid,
		label: "回测",
		element: StrategyRun,
	},
	{
		key: TRADING_PLAN_PAGE,
		icon: LayoutGrid,
		label: "当日交易",
		element: TradingPlan,
	},
	{
		key: POSITION_INFO_PAGE,
		icon: WeightIcon,
		label: "持仓信息",
		element: PositionInfo,
	},
	{
		key: REAL_MARKET_CONFIG_PAGE,
		icon: ListBulletIcon,
		label: "策略实盘",
		element: TradingPage,
	},
	{
		key: FAQ_PAGE,
		icon: HelpCircleIcon,
		label: "常见问题解答",
		element: FAQ,
	},
	{
		key: CHANGE_LOGS_PAGE,
		icon: HistoryIcon,
		label: "更新日志",
		element: ChangeLogs,
	},
]
