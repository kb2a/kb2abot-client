const fs = require("fs");
const workerThreads = require("worker_threads");

/////////////////////////////////////////////////////
// =============== GLOBAL VARIABLE =============== //
/////////////////////////////////////////////////////
const helpers = require("../helpers");
globalThis.kb2abot = require("../kb2abot-global.js").apply({
	helpers,
	utils: helpers.loader("utils", true) // true means "in silent mode(no log)"
});
kb2abot.plugins = helpers.loader("plugins", true);
// plugins load sau vì plugin cần các hàm utils
/////////////////////////////////////////////////////
// ============ END OF GOBAL VARIBALE ============ //
/////////////////////////////////////////////////////

const {parseJSON} = kb2abot.utils;
const {
	isJ2teamCookie,
	// truncateMusics,
	checkCredential,
	generateAppState
} = kb2abot.utils.DEPLOY;
const {workerData} = workerThreads;

const deploy = async data => {
	// truncateMusics();
	const parsedJSON = await parseJSON(fs.readFileSync(data.botDir));
	const unofficialAppState = isJ2teamCookie(parsedJSON)
		? generateAppState(parsedJSON)
		: parsedJSON;
	const {id, name, appState: officialAppState} = await checkCredential({
		appState: unofficialAppState
	});
	fs.writeFileSync(data.botDir, JSON.stringify(officialAppState));
	Object.assign(kb2abot, {
		id
	});

	console.log("Dang tai datastore . . .");
	kb2abot.datastore = await kb2abot.helpers.loadDatastore(id);
	require("./kb2abot.js")(officialAppState);
	// require init ở đây bởi vì nếu init sớm hơn thì global kb2abot.id chưa sẵn sàng => error
	console.log(`kb2abot da cai vao tai khoan ${name} (${id})!`);
};
deploy(workerData);

module.exports = deploy;
