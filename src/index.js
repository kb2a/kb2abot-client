import dotenv from "dotenv"
dotenv.config()
import path from "path"
import glob from "glob"
import cluster from "cluster"
import * as Logger from "kb2abot/util/logger"

// import * as Serverline from "./util/serverline"
import * as Task from "./tasks"
import {convert_to_string_time} from "./util/common"
import Bootloader from "./Bootloader"

const memoryUsages = [0]
const {success, error, warn} = Logger
Logger.setPrefix("INTERNAL", ["black", "bgWhite"])
const botPaths = glob.sync("./bots/*.hjson", {
	ignore: ["./bots/example-bot.hjson", "./bots/README.txt"]
})

const bootloader = new Bootloader()
bootloader.use(Task.fakeHttp(process.env.FAKE_HTTP_PORT))
bootloader.use(Task.requireNode(process.env.REQUIRE_NODE_VER))
bootloader.use(Task.updateClient())
bootloader.use(Task.updateCore())

const timeStart = Date.now()
await bootloader.load({verbose: true})

if (botPaths.length == 0) {
	error("There is no cookies in your /bots")
}

for (const botPath of botPaths) {
	cluster.setupPrimary({
		exec: "./src/cluster-api/index.js",
		args: ["--bot", path.join(process.cwd(), botPath)]
	})
	const worker = cluster.fork()
	success(
		`API - Created api cluster "${path.basename(botPath)}" PID: ${
			worker.process.pid
		}`
	)
}

success(`Done for ${convert_to_string_time(Date.now() - timeStart)}!`)
// Serverline.init("kb2abot> ")
// registerCommand("test", () => console.log("amogus"))

cluster.on("exit", (worker, code, signal) => {
	if (signal) warn(`Bot PID: ${worker.process.pid} stopped, SIGNAL: ${signal}`)
	else
		(code == 0 ? warn : error)(
			`Bot PID: ${worker.process.pid} stopped, ERROR_CODE: ${code}`
		)
})

cluster.on("online", worker => {
	worker.send("memoryUsage")
	worker.on("message", dd => {
		if (dd.event == "memoryUsage") {
			memoryUsages[worker.id] = dd.data.heapTotal / 1024 / 1024
			setTimeout(() => {
				if (!worker.isDead()) worker.send("memoryUsage")
			}, 2000)
		}
	})
})

process.on("uncaughtException", err => {
	error("Caught exception: ", err)
})

setInterval(() => {
	const memoryUsage = memoryUsages.reduce((a, b) => a + b)
	Logger.setTerminalTitle(
		`KB2ABOT - CLUSTERS: ${botPaths.length} - MEMORY: ${memoryUsage.toFixed(
			2
		)}MB`
	)
}, 2000)
