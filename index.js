const path = require("path");
const childProcess = require("child_process");
const bots = [];
const isRunning = require("is-running");
const os = require("os");

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
	const semver = require("semver");
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
	const git = require("simple-git")();
	const initResult = await git.init();
	if (!initResult.existing) {
		await git.addRemote("origin", "https://github.com/khoakomlem/kb2abot");
		await git.fetch("origin", "master"); //git fetch origin master
	}
	await git.reset(["origin/master", "--hard"]); //git reset origin/master --hard
};

const foolHeroku = async () => {
	const server = require("http").createServer((req, res) => {
		res.writeHead(200, "OK", {
			"Content-Type": "text/plain"
		});
		res.write("This is just a dummy HTTP server to fool Heroku.");
		res.end();
	});
	await server.listen(process.env.PORT || 0, "0.0.0.0");
};

const promptMultiple = async (question, choices) => {
	const Prompt = require("prompt-checkbox");
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

const chooseBot = async () => {
	const fs = require("fs");

	if (!fs.existsSync("bots")) {
		fs.mkdirSync("bots");
	}

	const botFiles = fs
		.readdirSync(__dirname + "/bots")
		.filter(name => name.indexOf(".json") != -1);

	if (botFiles.length == 0) {
		console.log("You do not have any cookie(s) in your /bots");
		process.exit();
	}

	const loadBotList =
		botFiles.length > 1
			? await promptMultiple(
					"Which cookie(s) do you want to load?",
					botFiles
			  )
			: botFiles;
	if (loadBotList.length == 0) {
		console.log("Nothing to do!");
		process.exit();
	}
	for (const botFileName of loadBotList) {
		loadBot(botFileName, `Starting kb2abot used [${botFileName}]`);
	}
	const readline = require("readline");
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
};

const loadBot = async (botFileName, message) => {
	console.log(message);
	let timeStart = Date.now();
	const cookieDir = path.join(__dirname, "bots", botFileName);
	const code =
		(await spawn("node", ["./server/index.js", `--bot="'${cookieDir}'"`])) %
		256;
	switch (code) {
		case 134:
			console.log("SIGABRT detected! Aborting all bots . . .");
			process.exit();
			break;
		default:
			if (Date.now() - timeStart < 10000) {
				console.log(
					`[${botFileName}] dies too frequently, please check your code and your cookie!`
				);
				process.exit();
			}
			loadBot(
				botFileName,
				`Restarting kb2abot used [${botFileName}]. . .`
			);
	}
};

const ora = require("ora");
const tasks = [
	{fn: checkNode, des: "checking node verion . . ."},
	{fn: checkUpdate, des: "checking updates . . ."},
	{fn: foolHeroku, des: "fooling Heroku . . ."}
];

(async () => {
	for (const task of tasks) {
		const spinner = ora(task.des).start();
		await task.fn();
		spinner.succeed();
		if (tasks.indexOf(task) >= tasks.length - 1) {
			chooseBot();
		}
	}
})();
