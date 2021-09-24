import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import ora from "ora"
import path from "path"
import cluster from "cluster"
import emoji from "node-emoji"

import * as bootloader from "./bootloader/index.js"
import getDirname from "es-dirname"

import {__dirname} from "./util/esm.util.js"
import { subname, convert_to_string_time } from "./util/common.util.js"
import { initLogger, setTerminalTitle } from "./util/console.util.js"

const memoryUsages = [0]
const timeStart = Date.now()
const botsDir = path.join(__dirname, "../bots")
const botList = fs
    .readdirSync(botsDir)
    .filter(
        name =>
        (name.includes(".txt") && name != "README.txt") ||
        name.includes(".json")
    )
if (botList.length == 0) return console.newLogger.error("There is no cookies in /bots")


process.on("uncaughtException", function(err) {
    console.log("Caught exception: ", err)
})

cluster.on("exit", (worker, code, signal) => {
    if (signal)
        console.newLogger.warn(
            `Bot PID: ${worker.process.pid} stopped, SIGNAL: ${signal}`
        )
    else
        console.newLogger[code == 0 ? "warn" : "error"](
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

initLogger(emoji.emojify(":star: INTERNAL"))
for (const taskKey in bootloader) {
    const task = bootloader[taskKey]
    if (!task.modes.includes(bootloadprocess.env.NODE_ENV)) continue
    const spinner = ora(task.des).start()
    try {
        await task.fn()
    } catch (e) {
        spinner.stop()
        console.log()
        console.newLogger.error(e)
        return
    }
    spinner.succeed()
}
console.log(
    "\n" +
    "██  ███ █  █ ███\n" +
    "█ █ █ █ ██ █ █_\n" +
    `█ █ █ █ █ ██ █    ${convert_to_string_time(Date.now() - timeStart)}!\n` +
    "██  ███ █  █ ███\n"
)

setInterval(() => {
    const memoryUsage = memoryUsages.reduce((a, b) => a + b)
    setTerminalTitle(
        `KB2ABOT - CLUSTERS: ${botList.length} - MEMORY: ${memoryUsage.toFixed(
				2
			)}MB`
    )
}, 2000)

for (const bot of botList) {
    const cookiePath = path.join(botsDir, bot)
    cluster.setupMaster({
        exec: deployPath,
        args: [
            "--cookiePath",
            cookiePath,
            "--name",
            subname(path.basename(cookiePath))
        ]
    })
    // console.log(["--cookiePath", cookiePath, "--name", subname(path.basename(cookiePath))]);
    const worker = cluster.fork()
    console.newLogger.log(
        `Dang tao cluster "${bot}" PID: ${worker.process.pid}`
    )
}