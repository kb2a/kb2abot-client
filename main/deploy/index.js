const fs = require("fs");
const emoji = require("node-emoji");
const minimist = require("minimist");
/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const helpers = require("../helpers");
globalThis.kb2abot = Object.assign(require("../kb2abot-global"), {
	helpers
});
// plugins load sau vì plugin cần các hàm utils
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const {initLogger} = require("../utils/CONSOLE");
const {
	convertJ2teamToAppstate,
	convertAtpToAppstate,
	// truncateMusics,
	checkCredential,
	getCookieType,
} = require("../utils/DEPLOY");

const deploy = async data => {
	try {
		const {name: botName, cookiePath} = data;
		initLogger(emoji.emojify(`:robot_face: ${botName}`));
		kb2abot.utils = await helpers.loader("utils", true);
		kb2abot.plugins = await helpers.loader("plugins", true);

		// truncateMusics();
		let unofficialAppState;
		const cookieText = fs.readFileSync(cookiePath).toString();
		const cookieType = getCookieType(cookieText);
<<<<<<< HEAD
		if (cookieType != -1) {
			console.newLogger.log("Cookie type: " + cookieType);
		}
=======
>>>>>>> a59015452548cb7a3748396334e9128aa348b96e
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
		Object.assign(kb2abot, {
			id
		});
		require("./kb2abot")(officialAppState);
		// require init ở đây bởi vì nếu init sớm hơn thì global kb2abot.id chưa sẵn sàng => error
		console.newLogger.success(`${name} (${id}) UP !`);
	}
	catch (e) {
		console.newLogger.error(e.message);
		process.exit(e.code);
	}
};
deploy(minimist(process.argv.slice(2)));

module.exports = deploy;
