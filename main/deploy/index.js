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
const {parseJSON} = require("../utils/COMMON");
const {
	isJ2teamCookie,
	// truncateMusics,
	checkCredential,
	generateAppState
} = require("../utils/DEPLOY");

const deploy = async data => {
	try {
		const {name: botName, cookiePath} = data;
		initLogger(emoji.emojify(`:robot_face: ${botName}`));
		kb2abot.utils = await helpers.loader("utils", true);
		kb2abot.plugins = await helpers.loader("plugins", true);

		// truncateMusics();
		const parsedJSON = await parseJSON(fs.readFileSync(cookiePath));
		const unofficialAppState = isJ2teamCookie(parsedJSON)
			? generateAppState(parsedJSON)
			: parsedJSON;
		const {id, name, appState: officialAppState} = await checkCredential({
			appState: unofficialAppState
		});
		fs.writeFileSync(cookiePath, JSON.stringify(officialAppState));
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
