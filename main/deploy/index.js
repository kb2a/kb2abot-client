const fs = require("fs");
const path = require("path");
const login = require("facebook-chat-api");
const workerThreads = require("worker_threads");


/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const helpers = require("../helpers");
globalThis.kb2abot = {
	id: 0, // *later
	utils: {}, // *later
	plugins: {}, // *later
	helpers,
	groupManager: {} // *later
}
kb2abot.utils = helpers.loader("utils", true); // load all utilities in silent mode
kb2abot.plugins = helpers.loader("plugins", true); // load all plugins in silent mode
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const GroupManager = require("./roles/GroupManager.js");
const deployKb2abot = require("./kb2abot.js");
const { parseJSON } = kb2abot.utils;
const { 
	isJ2teamCookie,
	truncateMusics,
	checkCredential,
	generateAppState,
} = kb2abot.utils.DEPLOY;
const { workerData } = workerThreads;

const deploy = async data => {
	// truncateMusics();
	const parsedJSON = await parseJSON(fs.readFileSync(data.botDir));
	const unofficialAppState = isJ2teamCookie(parsedJSON)
		? generateAppState(parsedJSON)
		: parsedJSON;
	const {id, name, appState: officialAppState} = await checkCredential({
		appState: unofficialAppState
	});
	fs.writeFileSync(data.botDir, officialAppState);
	Object.assign(kb2abot, {
		id,
		groupManager: new GroupManager({owner: id})
	});
	deployKb2abot(officialAppState, {});
	console.log(`kb2abot has started for username ${name} (${id})!`);
};
deploy(workerData);

module.exports = deploy;