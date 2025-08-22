/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-white group-[.toast]:text-black",
					error:
						"group toast group-[.toaster]:bg-red group-[.toaster]:bg-background group-[.toaster]:border-red-500 group-[.toaster]:text-red-600 dark:group-[.toaster]:text-foreground dark:group-[.toaster]:bg-red-900 group-[.toaster]:shadow-lg",
					success:
						"group toast group-[.toaster]:bg-green group-[.toaster]:bg-background group-[.toaster]:border-green-500 group-[.toaster]:text-green-600 dark:group-[.toaster]:text-foreground dark:group-[.toaster]:bg-green-900 group-[.toaster]:shadow-lg",
					warning:
						"group toast group-[.toaster]:bg-yellow group-[.toaster]:bg-background group-[.toaster]:text-yellow-600 dark:group-[.toaster]:text-foreground dark:group-[.toaster]:bg-yellow-900 group-[.toaster]:shadow-lg",
					info: "group toast group-[.toaster]:bg-blue group-[.toaster]:bg-background group-[.toaster]:border-blue-500 group-[.toaster]:text-blue-600 dark:group-[.toaster]:text-foreground dark:group-[.toaster]:bg-blue-900 group-[.toaster]:shadow-lg",
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
