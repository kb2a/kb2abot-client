const fs = require("fs");
const os = require("os");
const ora = require("ora");
const http = require("http");
const path = require("path");
const semver = require("semver");
const git = require("simple-git")();
const readline = require("readline");
const isRunning = require("is-running");
const Prompt = require("prompt-checkbox");
const childProcess = require("child_process");
const workerThreads = require('worker_threads');
const installChanged = require("install-changed");

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const helpers = require("./helpers");
globalThis.kb2abot = {
	id: 0, // *later
	utils: {}, // *later
	plugins: {}, // *later
	helpers,
}
// *later có nghĩa là sẽ load sau
// Tại sao bootloader cũng có global kb2abot?
// Vì bootloader là nơi test lỗi của các utils, plugins 
// bởi 2 cái đó do người dùng chỉnh sửa, thêm bớt nên 
// sẽ ko đáng tin lắm, có thể phát sinh lỗi nên cần preload
// để check tất cả lỗi. 
// (khi loadBot sẽ load lại utils, plugins, helpers thêm lần nữa)
// Hiện tại chỉ cần properties: id, utils, plugins và helpers thôi!
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const bots = [];
const botsDir = path.join(__dirname, "..", "bots");
const deployDir = path.join(__dirname, "deploy", "index.js");

const showStatusBots = () => {
	const lives = [],
		dies = [];
	for (const bot of bots) {
		if (isRunning(bot.pid)) {
			lives.push(bot);
		} else {
			dies.push(bot);
		}
	}
	let logMessage = "";
	for (const live of lives) {
		logMessage += `${live.pid} ${live.name} >> live${os.EOL}`;
	}
	for (const die of dies) {
		logMessage += `| ${die.pid} ${die.name} >> die${os.EOL}`;
	}
	console.log(logMessage);
};

const execShellCommand = cmd => {
	return new Promise(resolve => {
		childProcess.exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
				resolve();
			}
			resolve(stdout ? stdout : stderr);
		});
	});
};

const spawn = (cmd, arg) => {
	return new Promise(resolve => {
		const npmProcess = childProcess.spawn(cmd, arg, {
			shell: true,
			stdio: "inherit",
			cwd: __dirname
		});
		bots.push({
			pid: npmProcess.pid,
			name: path.basename(arg[1]).split(".")[0]
		});
		npmProcess.on("close", code => {
			resolve(code);
		});
	});
};

const checkNode = async () => {
	const nodeVersion = semver.parse(process.version);
	if (
		nodeVersion.major < 12 ||
		(nodeVersion.major == 12 && nodeVersion.minor < 9)
	) {
		console.error(
			"ERROR: Node.js 12+ (>=12.9) is required to run this! (current: " +
				process.version +
				")"
		);
		process.exit(0);
	}
};

const checkUpdate = async () => {
	const initResult = await git.init();
	if (!initResult.existing) {
		await git.addRemote("origin", "https://github.com/khoakomlem/kb2abot");
	}

	await git.fetch("origin", "master"); //git fetch origin master
	await git.reset(["origin/master", "--hard"]); //git reset origin/master --hard
	try {
		installChanged.watchPackage();
	} catch (e) {
		console.log();
		console.log("Installing new module(s)");
		await execShellCommand("npm install");
	}
};

const foolHeroku = async () => {
	const server = http.createServer((req, res) => {
		res.writeHead(200, "OK", {
			"Content-Type": "text/plain"
		});
		res.write("This is just a dummy HTTP server to fool Heroku.");
		res.end();
	});
	await server.listen(process.env.PORT || 0, "0.0.0.0");
};

const promptMultiple = async (question, choices) => {
	const prompt = new Prompt({
		name: "multiplechoice",
		message: question,
		radio: true,
		choices
	});
	try {
		const answer = await prompt.run();
		prompt.ui.close();
		return answer;
	} catch (err) {
		prompt.ui.close();
		process.exit();
	}
	return await prompt.run();
};

const assignCmdHelper = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const readInput = () => {
		rl.question("", function(data) {
			switch (data) {
				case "status":
					showStatusBots();
					break;
				case "cls":
					console.clear();
					break;
			}
			readInput();
		});
	};
	readInput();
}

const chooseBot = async () => {

	if (!fs.existsSync("bots")) {
		fs.mkdirSync("bots");
	}

	const botFiles = fs
		.readdirSync(botsDir)
		.filter(name => name.indexOf(".json") != -1);

	if (botFiles.length == 0) {
		console.log("You do not have any cookie(s) in your /bots");
		process.exit();
	}

	const loadBotList =
		botFiles.length > 1
			? await promptMultiple(
					"Which cookie(s) do you want to load? (space = choose, enter = submit)",
					botFiles
			  )
			: botFiles;
	if (loadBotList.length == 0) {
		console.log("Nothing to do!");
		process.exit();
	}
	// for (const botFileName of loadBotList) {
	// 	loadBot(botFileName, `Starting kb2abot used [${botFileName}]`);
	// }
	return loadBotList;
};

const loadBot = async (botFileName, message) => {
	console.log("BOOTLOADER: " + message);
	let timeStart = Date.now();
	const cookieDir = path.join(botsDir, botFileName);
	kb2abot.utils = helpers.loader("utils", false); // preload
	kb2abot.plugins = helpers.loader("plugins", false); // preload
	const worker = new workerThreads.Worker(deployDir, {
		workerData: {
			botDir: cookieDir,
			botName: kb2abot.utils.subname(path.basename(cookieDir))
		}
	});
};

const tasks = [];
const isDev = process.argv.slice(2)[0] == "dev";
tasks.push({fn: checkNode, des: "checking node verion . . ."});
!isDev && tasks.push({fn: checkUpdate, des: "checking updates . . ."});
tasks.push({fn: foolHeroku, des: "fooling Heroku . . ."});
// tasks.push({fn: foolHeroku, des: "loading plugins . . ."});

const bootloader = async () => {
	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		const spinner = ora(task.des).start();
		await task.fn();
		spinner.succeed();
		if (i >= tasks.length - 1) {
			const loadBotList = await chooseBot();
			assignCmdHelper();
			for (const botFileName of loadBotList) {
				loadBot(botFileName, `Starting kb2abot using [${botFileName}]`);
			}
		}
	}
}

bootloader();

module.exports = bootloader;