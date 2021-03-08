const fs = require("fs");
const ora = require("ora");
const path = require("path");
const cluster = require("cluster");
const emoji = require("node-emoji");

const {subname} = require("./deploy/helpers/common");
const {initLogger, setTerminalTitle} = require("./deploy/helpers/console");
initLogger(emoji.emojify(":star: INTERNAL"));
let memoryUsages = [0];

/////////////////////////////////////////////////////
// =========== 	EXTRACT PLUGINS & GAMES ========== //
/////////////////////////////////////////////////////
const AdmZip = require("adm-zip");
const paths = {
	plugins: {
		e: path.join(__dirname, "deploy/plugins/extracted_plugins"),
		dir: path.join(__dirname, "deploy/plugins")
	},
	games: {
		e: path.join(__dirname, "deploy/games/extracted_games"),
		dir: path.join(__dirname, "deploy/games")
	}
};
for (const key in paths) {
	const {e, dir} = paths[key];
	let extracted = "";
	try {
		fs.readFileSync(e).toString();
	} catch {
		extracted = "";
	}
	const zipfiles = fs
		.readdirSync(dir)
		.filter(filename => filename.includes(".zip") && !extracted.includes(filename));
	for (const file of zipfiles) {
		const zipPath = path.join(dir, file);
		const zip = new AdmZip(zipPath);
		zip.extractAllTo(dir);
		console.newLogger.success(`EXTRACTED ${key.toUpperCase()}: ${file}`);
		fs.appendFileSync(e, file + "\n");
	}
}
/////////////////////////////////////////////////////
// =========== 	EXTRACT PLUGINS & GAMES ========== //
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const Kb2abotGlobal = require("./deploy/Kb2abotGlobal");
globalThis.loader = require("./deploy/loader");
globalThis.kb2abot = new Kb2abotGlobal();
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const botsDir = path.join(__dirname, "../bots");
const deployPath = path.join(__dirname, "./deploy/index.js");

cluster.on("exit", (worker, code, signal) => {
	if (signal) {
		console.newLogger.warn(`Bot PID: ${worker.process.pid} da dung, SIGNAL: ${signal}`);
	} else {
		const funcKey = code == 0 ? "warn" : "error";
		console.newLogger[funcKey](`Bot PID: ${worker.process.pid} da dung, ERROR_CODE: ${code}`);
	}
});

cluster.on("online", worker => {
	worker.send("memoryUsage");
	worker.on("message", dd => {
		if (dd.event == "memoryUsage") {
			memoryUsages[worker.id] = dd.data.heapTotal / 1024 / 1024;
			setTimeout(() => worker.send("memoryUsage"), 2000);
		}
	});
});

const bootloader = async () => {
	const timeStart = Date.now();
	console.newLogger.log("Dang kiem tra cu phap code . . .\n");
	try {
		await loader.slowLoad("bootloader", path.join(__dirname, "bootloader"));
		kb2abot.schemas = await loader.slowLoad("schemas");
		kb2abot.helpers = await loader.slowLoad("helpers");
		kb2abot.games = await loader.slowLoad("games");
		kb2abot.gameManager = new kb2abot.helpers.GameManager(kb2abot.games); // for description's game plugin
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
		updateCli,
		foolHeroku,
		checkNode,
	} = loader.load(path.join(__dirname, "bootloader"));
	const tasks = [];
	// const isDev = process.argv.slice(2)[0] == "dev";
	tasks.push(checkInternet);
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
	setInterval(() => {
		const memoryUsage = memoryUsages.reduce((a,b) => a+b);
		setTerminalTitle(`KB2ABOT - CLUSTERS: ${botList.length} - MEMORY: ${memoryUsage.toFixed(2)}MB`);
	}, 3000);
	for (const bot of botList) {
		const cookiePath = path.join(botsDir, bot);
		cluster.setupMaster({
			exec: deployPath,
			args: ["--cookiePath", cookiePath, "--name", subname(path.basename(cookiePath))]
		});
		// console.log(["--cookiePath", cookiePath, "--name", subname(path.basename(cookiePath))]);
		const worker = cluster.fork();
		console.newLogger.log(`Dang tao cluster "${bot}" PID: ${worker.process.pid}`);
	}
};

bootloader();
