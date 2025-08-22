/*
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 * Licensed under BUSL-1.1 — see LICENSE.
 */

import fs from "node:fs"

export default async function (context) {
	const localeDir = context.appOutDir + "/locales/"

	fs.readdir(localeDir, function (_err, files) {
		//files is array of filenames (basename form)
		if (!(files && files.length)) return
		for (let i = 0, len = files.length; i < len; i++) {
			// zh 和 en 开头的都不删
			if (!(files[i].startsWith("en") || files[i].startsWith("zh"))) {
				fs.unlinkSync(localeDir + files[i])
			}
		}
	})
}
