/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import type { Config } from "tailwindcss"
const { heroui } = require("@heroui/theme")

const config = {
	darkMode: ["class"],
	content: [
		"./src/renderer/**/*.{ts,tsx}",
		"./src/renderer/index.html",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				// 定义一个自定义的中文字体栈
				sans: [
					'"PingFang SC"', // 苹果设备上的中文系统字体
					'"Microsoft YaHei"', // Windows 系统上的中文字体
					"Helvetica",
					"Arial",
					"sans-serif",
				],
				terminal: [
					'"Source Han Mono"', // Adobe 思源等宽（中英文优化）
					'"Noto Sans Mono CJK SC"', // Google 的 Noto Sans Mono CJK（简体中文）
					"Menlo",
					"Consolas",
					"SimHei",
					'"Courier New"',
					"monospace",
				],
			},
			boxShadow: {
				input:
					"0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)",
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				shine: {
					from: { backgroundPosition: "200% 0" },
					to: { backgroundPosition: "-200% 0" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"fade-out": {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				overlayShow: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				overlayHide: {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				contentShow: {
					from: {
						opacity: "0",
						transform: "translate(-50%, -50%) scale(0.88)",
					},
					to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
				},
				contentHide: {
					from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
					to: {
						opacity: "0",
						transform: "translate(-50%, -50%) scale(0.88)",
					},
				},
			},
			animation: {
				in: "fade-in 0.3s ease-out",
				out: "fade-out 0.3s ease-in",
				shine: "shine 8s ease-in-out infinite",
				"accordion-up": "accordion-up 0.2s ease-out",
				"accordion-down": "accordion-down 0.2s ease-out",
				"caret-blink": "caret-blink 1.25s ease-out infinite",
				overlayShow: "overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
				overlayHide: "overlayHide 300ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentHide: "contentHide 300ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [
		async () => (await import("tailwindcss-animate")).default,
		heroui({
			themes: {
				light: {
					layout: {
						// fontSize: {
						//     small: "calc(var(--font-size) * 0.875)",
						//     medium: "calc(var(--font-size))",
						//     large: "calc(var(--font-size) * 1.125)",
						//     tiny: "calc(var(--font-size) * 0.75)",
						// },
						// lineHeight: {
						//     small: "1.25rem",
						//     medium: "1.5rem",
						//     large: "1.75rem",
						//     tiny: "1rem",
						// },
						radius: {
							small: "calc(var(--radius) - 4px)",
							medium: "calc(var(--radius) - 2px)",
							large: "calc(var(--radius))",
						},
					},
				},
				dark: {
					layout: {
						// fontSize: {
						//     small: "calc(var(--font-size) * 0.875)",
						//     medium: "calc(var(--font-size))",
						//     large: "calc(var(--font-size) * 1.125)",
						//     tiny: "calc(var(--font-size) * 0.75)",
						// },
						// lineHeight: {
						//     small: "1.25rem",
						//     medium: "1.5rem",
						//     large: "1.75rem",
						//     tiny: "1rem",
						// },
						radius: {
							small: "calc(var(--radius) - 4px)",
							medium: "calc(var(--radius) - 2px)",
							large: "calc(var(--radius))",
						},
					},
				},
			},
		}),
	],
} satisfies Config

export default config
