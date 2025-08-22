/*
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 * Licensed under BUSL-1.1 — see LICENSE.
 */

export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-max-line-length": [0, "always", 200], // -- 禁用 body 长度限制
		"header-max-length": [0, "always", 200], // -- 禁用 header 长度限制或设置更大的值
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"test",
				"build",
				"ci",
				"chore",
				"revert",
			],
		],
	},
}
