const fs = require("fs");
const emoji = require("node-emoji");
const minimist = require("minimist");
const path = require("path");

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const Kb2abotGlobal = require("./Kb2abotGlobal");
globalThis.loader = require("./loader");
globalThis.kb2abot = new Kb2abotGlobal();

kb2abot.schemas = loader.load(path.join(__dirname, "schemas"));
kb2abot.helpers = loader.load(path.join(__dirname, "helpers"));

const {Account} = require("./roles");
kb2abot.account = new Account();

kb2abot.games = loader.load(path.join(__dirname, "games"));
kb2abot.gameManager = new kb2abot.helpers.GameManager(kb2abot.games);

kb2abot.plugins = loader.load(path.join(__dirname, "plugins"));
kb2abot.pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const {
	convertJ2teamToAppstate,
	convertAtpToAppstate,
	// truncateMusics,
	checkCredential,
	getCookieType,
} = kb2abot.helpers.deploy;

process.on("message", msg => { // receive ping message from master
	if (msg == "memoryUsage") {
		process.send({ // send memoryUsage to master
			event: msg,
			data: process.memoryUsage()
		});
	}
});

const deploy = async data => {
	try {
		const {name: botName, cookiePath} = data;
		const {initLogger} = kb2abot.helpers.console;
		initLogger(emoji.emojify(`:robot_face: ${botName}`));
		let unofficialAppState;
		const cookieText = fs.readFileSync(cookiePath).toString();
		const cookieType = getCookieType(cookieText);

		if (cookieType != -1) {
			console.newLogger.log("Cookie type: " + cookieType);
		}

		switch (cookieType) {
		case "j2team":
			unofficialAppState = convertJ2teamToAppstate(cookieText);
			break;
		case "atp":
			unofficialAppState = convertAtpToAppstate(cookieText);
			break;
		case -1:
			console.newLogger.error(`Cookie ${cookiePath} không hợp lệ, vui lòng kiểm tra lại!`);
			process.exit();
			break;
		}

		const {id, name, appState: officialAppState} = await checkCredential({
			appState: unofficialAppState
		});
		kb2abot.id = id;
		kb2abot.account.id = id;
		require("./kb2abot")(officialAppState);
		// require kb2abot ở đây bởi vì nếu require sớm hơn thì global kb2abot.id
		// chưa sẵn sàng cho kb2abot.js => error
		console.newLogger.success(`${name} (${id}) UP !`);
	}
	catch (e) {
		console.newLogger.error(e.message);
		process.exit(e.code);
	}
};

if (process.argv.length > 2)
	deploy(minimist(process.argv.slice(2)));

module.exports = deploy;
