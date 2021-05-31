const {execShellCommand} = require('../deploy/helpers/common');
const axios = require('axios');

module.exports = {
	des: 'Kiem tra va cap nhat kb2abot-cli',
	fn: async () => {
		const {data} = await axios.get(
			'https://raw.githubusercontent.com/kb2abot/kb2abot-cli/main/package.json'
		);
		const {version} = data;
		let currentVersion;
		try {
			currentVersion = await execShellCommand('kb2abot-cli -v');
		} catch (e) {
			currentVersion = e.message;
		}
		if (currentVersion != version) {
			await execShellCommand('npm i kb2abot-cli@latest -g');
		}
	}
};
