const fs = require('fs');
const ora = require('ora');
const path = require('path');
const cluster = require('cluster');
const emoji = require('node-emoji');

const {subname} = require('./deploy/helpers/common');
const {initLogger, setTerminalTitle} = require('./deploy/helpers/console');
initLogger(emoji.emojify(':star: INTERNAL'));
const memoryUsages = [0];

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const Kb2abotGlobal = require('./deploy/Kb2abotGlobal');
globalThis.loader = require('./deploy/loader');
globalThis.kb2abot = new Kb2abotGlobal();
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// =========== 	EXTRACT PLUGINS & GAMES ========== //
/////////////////////////////////////////////////////
const AdmZip = require('adm-zip');
const paths = {
	plugins: {
		e: path.join(kb2abot.config.DIR.PLUGIN, 'extracted_plugins'),
		dir: kb2abot.config.DIR.PLUGIN
	},
	games: {
		e: path.join(kb2abot.config.DIR.GAME, 'extracted_games'),
		dir: kb2abot.config.DIR.GAME
	}
};
for (const key in paths) {
	const {e, dir} = paths[key];
	let extracted = '';
	try {
		extracted = fs.readFileSync(e).toString();
	} catch {
		extracted = '';
	}
	const zipfiles = fs
		.readdirSync(dir)
		.filter(
			filename => filename.includes('.zip') && !extracted.includes(filename)
		);
	for (const file of zipfiles) {
		const zipPath = path.join(dir, file);
		const zip = new AdmZip(zipPath);
		zip.extractAllTo(dir, true);
		console.newLogger.success(`EXTRACTED ${key.toUpperCase()}: ${file}`);
		fs.appendFileSync(e, file + '\n');
	}
}
/////////////////////////////////////////////////////
// =========== 	EXTRACT PLUGINS & GAMES ========== //
/////////////////////////////////////////////////////

const botsDir = path.join(__dirname, '../bots');
const deployPath = path.join(__dirname, './deploy/index.js');

cluster.on('exit', (worker, code, signal) => {
	if (signal) {
		console.newLogger.warn(
			`Bot PID: ${worker.process.pid} da dung, SIGNAL: ${signal}`
		);
	} else {
		const funcKey = code == 0 ? 'warn' : 'error';
		console.newLogger[funcKey](
			`Bot PID: ${worker.process.pid} da dung, ERROR_CODE: ${code}`
		);
	}
});

cluster.on('online', worker => {
	worker.send('memoryUsage');
	worker.on('message', dd => {
		if (dd.event == 'memoryUsage') {
			memoryUsages[worker.id] = dd.data.heapTotal / 1024 / 1024;
			setTimeout(() => {
				if (!worker.isDead()) worker.send('memoryUsage');
			}, 2000);
		}
	});
});

const bootloader = async () => {
	const timeStart = Date.now();
	console.newLogger.log('Dang kiem tra cu phap code . . .\n');
	try {
		kb2abot.bootloader = loader(path.join(__dirname, 'bootloader'));
		kb2abot.schemas = loader(path.join(__dirname, 'deploy/schemas'));
		kb2abot.helpers = loader(kb2abot.config.DIR.HELPER);
		kb2abot.gameManager = new kb2abot.helpers.GameManager(
			loader(kb2abot.config.DIR.GAME)
		);
		kb2abot.pluginManager = new kb2abot.helpers.PluginManager();
		await kb2abot.pluginManager.loadAllPlugins(undefined, false);
	} catch (e) {
		console.newLogger.error(e.stack);
		console.newLogger.error(
			'Vui long kiem tra lai file tren hoac lien he ho tro: fb.com/khoakomlem'
		);
		process.exit();
	}
	const latency = Date.now() - timeStart;
	console.log(
		'\n' +
			'██  ███ █  █ ███\n' +
			'█ █ █ █ ██ █ █_\n' +
			`█ █ █ █ █ ██ █    ${latency}ms!\n` +
			'██  ███ █  █ ███\n'
	);

	const {
		// cli,
		checkInternet,
		update,
		updateCli,
		foolHeroku,
		checkNode
	} = kb2abot.bootloader;
	const tasks = [];
	const isDev = process.argv.slice(2)[0] == 'dev';
	tasks.push(checkInternet);
	if (!isDev) tasks.push(...[update, updateCli]);
	tasks.push(foolHeroku);
	tasks.push(checkNode);
	// tasks.push(cli);

	for (const task of tasks) {
		const spinner = ora(task.des).start();
		try {
			await task.fn();
		} catch (e) {
			console.log();
			console.newLogger.error(e);
			spinner.stop();
			process.exit();
		}
		spinner.succeed();
	}
	const botList = fs
		.readdirSync(botsDir)
		.filter(
			name =>
				(name.includes('.txt') && name != 'README.txt') ||
				name.includes('.json')
		); // array include extension *.txt
	if (botList.length == 0) {
		console.newLogger.error('Ban chua dat cookie vao folder /bots');
	}
	setInterval(() => {
		const memoryUsage = memoryUsages.reduce((a, b) => a + b);
		setTerminalTitle(
			`KB2ABOT - CLUSTERS: ${botList.length} - MEMORY: ${memoryUsage.toFixed(
				2
			)}MB`
		);
	}, 3000);
	for (const bot of botList) {
		const cookiePath = path.join(botsDir, bot);
		cluster.setupMaster({
			exec: deployPath,
			args: [
				'--cookiePath',
				cookiePath,
				'--name',
				subname(path.basename(cookiePath))
			]
		});
		// console.log(["--cookiePath", cookiePath, "--name", subname(path.basename(cookiePath))]);
		const worker = cluster.fork();
		console.newLogger.log(
			`Dang tao cluster "${bot}" PID: ${worker.process.pid}`
		);
	}
};

bootloader();
