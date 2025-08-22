/*
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 * Licensed under BUSL-1.1 — see LICENSE.
 */

import notarize from "@electron/notarize"

export default async function notarizing(context) {
	const { electronPlatformName, appOutDir } = context
	if (
		electronPlatformName !== "darwin" ||
		!process.env.APPLE_ID ||
		!process.env.APPLE_PASSWORD
	) {
		return
	}

	const appName = context.packager.appInfo.productFilename
	return await notarize({
		appBundleId: "Quantclass",
		appPath: `${appOutDir}/${appName}.app`,
		appleId: process.env.APPLE_ID,
		appleIdPassword: process.env.APPLE_PASSWORD,
	})
}
