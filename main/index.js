const fs = require("fs");
const ora = require("ora");
const path = require("path");
const cluster = require("cluster");
const emoji = require("node-emoji");

const {subname} = require("./utils/COMMON");
const {initLogger} = require("./utils/CONSOLE");
initLogger(emoji.emojify(":star: INTERNAL"));
const k2babotGlobalModel = require("./kb2abot-global");
const helpers = require("./helpers");
/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
globalThis.kb2abot = Object.assign(k2babotGlobalModel, {
	helpers
});

// Tại sao file bootloader này cũng có global kb2abot?
// Vì bootloader là nơi test lỗi của các utils, plugins
// bởi 2 cái đó do người dùng chỉnh sửa, thêm bớt nên
// sẽ ko đáng tin lắm, có thể phát sinh lỗi nên cần preload
// để check tất cả lỗi.
// (khi loadBot sẽ load lại utils, plugins, helpers thêm lần nữa)
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////


const {cli, checkInternet, checkNode, foolHeroku, preload, update} = require("./bootloader");
const botsDir = path.join(__dirname, "../bots");
const deployPath = path.join(__dirname, "./deploy/index.js");

const tasks = [];
const isDev = process.argv.slice(2)[0] == "dev";
tasks.push(checkInternet);
!isDev && tasks.push(update);
tasks.push(foolHeroku);
tasks.push(checkNode);
tasks.push(preload);
tasks.push(cli);

cluster.on("exit", (worker, code, signal) => {
	if (signal) {
		console.newLogger.warn(`Bot PID: ${worker.process.pid} da dung, SIGNAL: ${signal}`);
	} else {
		const func = code == 0 ? "warn" : "error";
		console.newLogger[func](`BOt PID: ${worker.process.pid} da dung, ERROR_CODE: ${code}`);
	}
});

const bootloader = async () => {
	for (const task of tasks) {
		const spinner = ora(task.des).start();
		try {
			await task.fn();
		}
		catch(e) {
			console.newLogger.error(e.message);
			process.exit();
		}
		spinner.succeed();
	}
	const botList = fs
		.readdirSync(botsDir)
		.filter(name => name.indexOf(".json") != -1); // array include extension *.json
	if (botList.length == 0) {
		console.newLogger.error("Ban chua dat cookie vao folder /bots");
	}
	for (const bot of botList) {
		const cookiePath = path.join(botsDir, bot);
		cluster.setupMaster({
			exec: deployPath,
			args: ["--cookiePath", cookiePath, "--name", subname(path.basename(cookiePath))]
		});
		const worker = cluster.fork();
		console.newLogger.log(`Dang tao cluster "${bot}" PID: ${worker.process.pid}`);
	}
};

bootloader();

module.exports = bootloader;
