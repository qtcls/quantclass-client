import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/main/server/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: "/Users/jiantianjianghui/Downloads/test_xbx/code/data/FuelBinStat.db",
	},
})
