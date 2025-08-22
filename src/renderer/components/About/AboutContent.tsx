/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import AboutInfo from "@/renderer/components/About/AboutInfo"
import { AboutTheme } from "@/renderer/components/About/AboutTheme"
import React from "react"

interface AboutContentProps {
	activeItem: string
}

const contentMap = {
	common: <AboutTheme />,
	about: <AboutInfo />,
}

const AboutContent: React.FC<AboutContentProps> = ({ activeItem }) => {
	return contentMap[activeItem as keyof typeof contentMap]
}

export default AboutContent
