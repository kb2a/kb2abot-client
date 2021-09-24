const fs = require("fs");
const path = require("path");
const git = require("simple-git")();
const decache = require("decache");
const {execShellCommand} = require("../main/deploy/helpers/common");
const {dependencies} = require("../package.json");

(async () => {
	console.log("Initing git remote . . .");
	const initResult = await git.init();
	if (!initResult.existing) {
		await git.addRemote("origin", "https://github.com/sussy-bot/susbot");
	}
	console.log("Fetching data . . .");
	await git.fetch("origin", "main"); // git fetch origin main
	await git.reset(["origin/main", "--hard"]); // git reset originmain --hard

	decache(path.join(__dirname, "../package.json"));
	const newPackage = require("../package.json");
	for (const key in dependencies) {
		if (!newPackage.dependencies[key]) {
			newPackage.dependencies[key] = dependencies[key];
		}
	}

	fs.writeFileSync(
		path.join(__dirname, "../package.json"),
		JSON.stringify(newPackage, null, "\t")
	);
	console.log("Updating new dependencies . . .");
	await execShellCommand("npm install");
	console.log("Updating susbot-cli . . .");
	await execShellCommand("npm i susbot-cli@latest -g");
})();
