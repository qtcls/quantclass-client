/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { loader } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new JSONWorker()
		}
		return new EditorWorker()
	},
}

loader.config({ monaco })
loader.init().then(() => {})
