import { Tabs } from "@radix-ui/react-tabs"
import { TabsList } from "./ui/tabs"
import { TabsTrigger } from "./ui/tabs"
import { toast } from "sonner"

export const SelectTabs = ({
	tabs,
	defaultValue,
	onValueChange,
}: {
	tabs: { label: string; value: string }[]
	defaultValue: string
	onValueChange: (value: string) => void
}) => {
	return (
		<Tabs
			defaultValue={defaultValue}
			onValueChange={(value) => {
				onValueChange(value)
			}}
		>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	)
}

export const PerformanceModeSelectTabs = ({
	name,
	defaultValue,
	onValueChange,
	showToast = true,
}: {
	name: string
	defaultValue: string
	onValueChange: (value: string) => void
	showToast?: boolean
}) => {
	const performanceModes = {
		ECONOMY: "经济",
		EQUAL: "均衡",
		PERFORMANCE: "性能",
	}
	const tabs = Object.keys(performanceModes).map((mode) => ({
		label: performanceModes[mode],
		value: mode,
	}))

	return (
		<SelectTabs
			tabs={tabs}
			defaultValue={defaultValue}
			onValueChange={(value) => {
				onValueChange(value)
				if (showToast) {
					toast.success(`${name}性能模式设置为${performanceModes[value]}`)
				}
			}}
		/>
	)
}
