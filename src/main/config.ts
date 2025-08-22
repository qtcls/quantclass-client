/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import path from "node:path"
import { app } from "electron"

export const CONFIG = {
	LOCK_FILE_NAME: "fuel.lock",
	UPDATE_ROCKET_LOCK_FILE_NAME: "update_rocket.lock",
	UPDATE_AQUA_LOCK_FILE_NAME: "update_aqua.lock",
	UPDATE_FUEL_LOCK_FILE_NAME: "update_fuel.lock",
	DEFAULT_ALL_DATA_PATH: path.join(
		app.getPath("home"),
		"quantclass-data-folder",
	),
	LOG_FILE_NAME: "main.log",
	LOG_FORMAT: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
}
