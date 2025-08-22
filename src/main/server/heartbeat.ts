/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { tradingCalender } from "@/main/utils/common.js"
import logger from "@/main/utils/wiston.js"
import dayjs from "dayjs"
import Store from "electron-store"
import type { Context } from "hono"
import { sendErrorToClient } from "../utils/tools.js"

const store = new Store()

// -- 心跳相关配置
const HEARTBEAT_CONFIG = {
	TIMEOUT_MINUTES: 2,
	CHECK_INTERVAL_MS: 30 * 1000,
	SCHEDULE_CHECK_INTERVAL_MS: 60 * 1000,
	MAX_RETRY_COUNT: 3,
	RETRY_DELAY_MS: 5000,
}

let heartbeatTimer: NodeJS.Timeout | null = null
let scheduleTimer: NodeJS.Timeout | null = null

// -- 检查心跳状态并在必要时重启进程
async function checkHeartbeat() {
	const now = dayjs()
	const tradingCalenders = await tradingCalender()
	const nowDay = now.format("YYYY-MM-DD")

	if (!tradingCalenders.includes(nowDay)) {
		logger.info("[heart] 非交易日，不检测心跳")
		return
	}

	const startTime = now.set("hour", 9).set("minute", 0)
	const endTime = now.set("hour", 15).set("minute", 30)

	const isWithinTradingHours = now.isBetween(startTime, endTime)

	if (!isWithinTradingHours) {
		logger.info("[heart] 非交易时间，不检测心跳")
		return
	}

	const isAutoRealTrading = store.get("auto_real_trading", false) as boolean
	const lastHeartbeatTimestamp = store.get("last_heartbeat_timestamp", null) as
		| number
		| null

	if (!isAutoRealTrading) {
		logger.info("[heart] 未启动自动实盘，不检测心跳")
		return
	}

	// -- 如果没有上次心跳时间，说明是首次启动或重新启动，更新为当前时间
	if (!lastHeartbeatTimestamp) {
		store.set("last_heartbeat_timestamp", now.valueOf())
		logger.info("[heart] 首次启动心跳检测，初始化时间戳")
		return
	}

	const lastHeartbeatTime = dayjs(lastHeartbeatTimestamp)
	const timeDiff = now.diff(lastHeartbeatTime, "minute")

	if (timeDiff > HEARTBEAT_CONFIG.TIMEOUT_MINUTES) {
		logger.warn(
			`[heart] 心跳超时 ${timeDiff - HEARTBEAT_CONFIG.TIMEOUT_MINUTES} 分钟，开始发送告警通知`,
		)
		await sendMsgToRobot()
		store.set("last_heartbeat_timestamp", now.valueOf())
	}
}

// -- 启动心跳检查
export async function startHeartbeatCheck() {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer)
	}

	if (scheduleTimer) {
		clearInterval(scheduleTimer)
	}

	// -- 先执行一次检查，确认当前是否需要启动定时器
	await checkHeartbeat()

	// -- 每分钟检查一次是否到达交易时间
	scheduleTimer = setInterval(async () => {
		const now = dayjs()
		const startTime = now.set("hour", 9).set("minute", 0)
		const endTime = now.set("hour", 15).set("minute", 30)

		logger.info(`[heart] 心跳状态: ${heartbeatTimer ? "运行中" : "未运行"}`)

		if (now.isBetween(startTime, endTime) && !heartbeatTimer) {
			heartbeatTimer = setInterval(
				checkHeartbeat,
				HEARTBEAT_CONFIG.CHECK_INTERVAL_MS,
			)
			logger.info("[heart] 到达交易时间，启动心跳检测")
		} else if (!now.isBetween(startTime, endTime) && heartbeatTimer) {
			clearInterval(heartbeatTimer)
			heartbeatTimer = null
			logger.info("[heart] 交易时间结束，停止心跳检测")
		}
	}, HEARTBEAT_CONFIG.SCHEDULE_CHECK_INTERVAL_MS)
}

// -- 停止心跳检查
export function stopHeartbeatCheck() {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer)
		heartbeatTimer = null
		logger.info("[heart] 心跳检测已停止")
	}
	if (scheduleTimer) {
		clearInterval(scheduleTimer)
		scheduleTimer = null
		logger.info("[heart] 调度检测已停止")
	}
}

// -- 心跳接口处理函数
export async function heartbeat(c: Context) {
	const now = dayjs()
	store.set("last_heartbeat_timestamp", now.valueOf())
	logger.info("[rocket] 心跳检测成功，更新时间戳")

	return c.json({
		code: 200,
		message: "success",
		data: {
			timestamp: now.valueOf(),
		},
	})
}

// -- 发送告警消息到机器人，支持重试机制
const sendMsgToRobot = async (retryCount = 0): Promise<void> => {
	const robotUrl = store.get(
		"real_market_config.message_robot_url",
		"",
	) as string
	const errorMessage =
		"检测到客户端下单模块异常挂起，请重启客户端后再观察是否恢复正常，如未恢复正常请联系助教"

	if (!robotUrl) {
		await sendErrorToClient(errorMessage)
		logger.warn("未配置消息机器人路径")
		return
	}

	try {
		await sendErrorToClient(errorMessage)
		await fetch(robotUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				msgtype: "text",
				text: {
					content: "客户端下单模块出现问题",
				},
			}),
		})
		logger.info("告警消息发送成功")
	} catch (e) {
		logger.error(`消息机器人请求失败，重试次数: ${retryCount}`, e)

		if (retryCount < HEARTBEAT_CONFIG.MAX_RETRY_COUNT) {
			logger.info(
				`${HEARTBEAT_CONFIG.RETRY_DELAY_MS}ms 后进行第 ${retryCount + 1} 次重试`,
			)
			setTimeout(() => {
				sendMsgToRobot(retryCount + 1)
			}, HEARTBEAT_CONFIG.RETRY_DELAY_MS)
		}
	}
}
