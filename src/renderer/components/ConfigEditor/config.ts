/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { editor } from "monaco-editor"

// -- 编辑器配置
export const editorOptions: editor.IStandaloneEditorConstructionOptions = {
	tabSize: 2,
	formatOnPaste: true,
	formatOnType: true,
	fixedOverflowWidgets: true,
	automaticLayout: true,
	suggest: {
		preview: true,
		previewMode: "prefix",
		localityBonus: true,
		selectionMode: "whenTriggerCharacter",
	},
}

// -- 默认配置内容
export const defaultConfig = {
	name: "策略1",
	hold_period: "3D",
	offset_list: [0],
	select_num: 10,
	cap_weight: 1,
	filter_list: [],
	factor_list: [],
	rebalance_time: "close-open",
}
