const fs = require("fs");
const ora = require("ora");
const path = require("path");
const cluster = require("cluster");
const emoji = require("node-emoji");

const {subname} = require("./helpers/common");
const {initLogger} = require("./helpers/console");
initLogger(emoji.emojify(":star: INTERNAL"));

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
globalThis.loader = require("./loader");
const schemas = loader.load(path.join(__dirname, "schemas"));
globalThis.kb2abot = new schemas.Kb2abotGlobal();
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const botsDir = path.join(__dirname, "../bots");
const deployPath = path.join(__dirname, "./deploy/index.js");

cluster.on("exit", (worker, code, signal) => {
	if (signal) {
		console.newLogger.warn(`Bot PID: ${worker.process.pid} da dung, SIGNAL: ${signal}`);
	} else {
		const func = code == 0 ? "warn" : "error";
		console.newLogger[func](`Bot PID: ${worker.process.pid} da dung, ERROR_CODE: ${code}`);
	}
});

const bootloader = async () => {
	const timeStart = Date.now();
	console.newLogger.log("Dang kiem tra cu phap code . . .\n");
	try {
		await loader.slowLoad("bootloader");
		kb2abot.helpers = await loader.slowLoad("helpers");
		kb2abot.schemas = await loader.slowLoad("schemas");
		kb2abot.plugins = await loader.slowLoad("plugins");
	}
	catch(e) {
		console.newLogger.error(e.stack);
		console.newLogger.error("Vui long kiem tra lai file tren hoac lien he ho tro: fb.com/khoakomlem");
		process.exit();
	}
	const latency = Date.now() - timeStart;
	console.log(
		"\n" +
		"██  ███ █  █ ███\n" +
		"█ █ █ █ ██ █ █_\n" +
		`█ █ █ █ █ ██ █    ${latency}ms!\n` +
		"██  ███ █  █ ███\n"
	);

	const {
		// cli,
		checkInternet,
		update,
		updateCli,
		foolHeroku,
		checkNode,
	} = loader.load(path.join(__dirname, "bootloader"));
	const tasks = [];
	const isDev = process.argv.slice(2)[0] == "dev";
	tasks.push(checkInternet);
	!isDev && tasks.push(update);
	tasks.push(updateCli);
	tasks.push(foolHeroku);
	tasks.push(checkNode);
	// tasks.push(cli);

	for (const task of tasks) {
		const spinner = ora(task.des).start();
		try {
			await task.fn();
		}
		catch(e) {
			console.log();
			console.newLogger.error(e);
			spinner.stop();
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
