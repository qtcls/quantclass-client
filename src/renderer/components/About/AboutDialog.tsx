/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import AboutContent from "@/renderer/components/About/AboutContent"
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/renderer/components/ui/dialog"
import React, { useState } from "react"
import AboutLayout from "./AboutLayout"
import AboutSidebar from "./AboutSidebar"

interface AboutDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

const AboutDialog: React.FC<AboutDialogProps> = ({ open, onOpenChange }) => {
	// const [activeItem, _setActiveItem] = useState("common")
	const [activeItem, setActiveItem] = useState("about")

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[80vh] p-0">
				<DialogTitle className="hidden">About</DialogTitle>
				<AboutLayout
					hideSidebar
					sidebar={
						<AboutSidebar activeItem={activeItem} onItemClick={setActiveItem} />
					}
				>
					<AboutContent activeItem={activeItem} />
				</AboutLayout>
			</DialogContent>
		</Dialog>
	)
}

export default AboutDialog
