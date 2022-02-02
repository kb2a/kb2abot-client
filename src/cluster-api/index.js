import url from "url"
import dotenv from "dotenv"
dotenv.config({
	path: url.fileURLToPath(url.resolve(import.meta.url, "../../.env"))
})
import {Deploy} from "kb2abot"
import io from "socket.io-client"
import si from "systeminformation"
import {Client as SocketClient} from "promise-socket.io"
import * as Logger from "kb2abot/util/logger"
import {fca as fcaLabel} from "kb2abot/deploy/facebook/label"

import * as Label from "../label"
import getBotOptions from "./getBotOptions"

const sysinfo = si.getStaticData()
const bot = await getBotOptions()

const socket = io(bot.remoteServer, {
	autoConnect: false
})
socket.on("connect", () => Logger.success("CONNECTED TO SERVER"))
socket.on("disconnect", () => Logger.error("DISCONNECTED TO SERVER"))

const pSocket = new SocketClient(socket)
pSocket.onPromise("ping", timeServer => timeServer)
pSocket.onPromise("memoryUsage", process.memoryUsage)
pSocket.onPromise("fca", async (method, args) => {
	if (client.api[method])
		return await client.api[method](...args)
	throw new Error(`Method ${method} not found`)
})
pSocket.onPromise("sysinfo.static", async () => await sysinfo)
pSocket.onPromise("sysinfo.time", si.time)
pSocket.onPromise("sysinfo.mem", si.mem)

let client = null
try {
	switch (bot.platform) {
	case "facebook":
		client = await Deploy.facebook(bot.credential, {
			apiOptions: bot.fcaOptions,
			externalHook: async function(err, message) {
				if (err) return Logger.error(err)
				try { 
					return await pSocket.emitPromise("handleMessage", message)
				}
				catch(err) {
					Logger.error(Label.remoteServer, "handleMessage:", err)
				}
			}
		})
		break
	}
} catch (err) {
	Logger.error(err.message)
	process.exit()
}

process.on("message", msg => { // for master console
	if (msg == "memoryUsage") {
		process.send({
			event: "memoryUsage",
			data: process.memoryUsage()
		})
	}
})

socket.connect()