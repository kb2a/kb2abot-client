const fs = require('fs');
const path = require('path');
const git = require('simple-git')();
const decache = require('decache');
const {execShellCommand} = require('../main/deploy/helpers/common');

(async () => {
	const initResult = await git.init();
	console.log('Initing git remote . . .');
	if (!initResult.existing) {
		await git.addRemote('origin', 'https://github.com/kb2ateam/kb2abot');
	}
	const {dependencies} = require('../package.json');

	console.log('Fetching data . . .');
	await git.fetch('origin', 'main'); // git fetch origin main
	await git.reset(['origin/main', '--hard']); // git reset originmain --hard

	decache(path.join(__dirname, '../package.json'));
	const newPackage = require('../package.json');
	for (const key in dependencies) {
		if (!newPackage.dependencies[key]) {
			newPackage.dependencies[key] = dependencies[key];
		}
	}

	fs.writeFileSync(
		path.join(__dirname, '../package.json'),
		JSON.stringify(newPackage, null, '\t')
	);
	console.log('Updating new dependencies . . .');
	await execShellCommand('npm install');
	console.log('Updating kb2abot-cli . . .');
	await execShellCommand('npm i kb2abot-cli@latest -g');
})();
