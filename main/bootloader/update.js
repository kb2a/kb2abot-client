const axios = require('axios');
const {version} = require('../../package.json');

module.exports = {
	des: 'Kiem tra va cap nhat kb2abot',
	fn: async () => {
		const {data} = await axios.get(
			'https://raw.githubusercontent.com/kb2ateam/kb2abot/main/package.json'
		);
		if (data.version != version) {
			const {data: info} = await axios.get(
				'https://api.github.com/repos/kb2ateam/kb2abot/git/refs/heads/main'
			);
			const {data: commit} = await axios.get(info.object.url);
			console.log();
			console.newLogger.debug(
				`Da co phien ban moi: ${data.version}, phien ban hien tai: ${version}, go "npm run update" de cap nhat!`
			);
			console.newLogger.debug(`Noi dung update: ${commit.message}`);
		}
	}
};
