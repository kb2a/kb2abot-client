const axios = require('axios');
const {version} = require('../../package.json');

module.exports = {
	des: 'Kiem tra va cap nhat kb2abot',
	fn: async () => {
		const {data} = await axios.get(
			'https://raw.githubusercontent.com/kb2ateam/kb2abot/main/package.json'
		);
		console.log();
		if (data.version != version) {
			console.newLogger.debug(
				`Da co phien ban moi: ${data.version}, phien ban hien tai: ${version}. Su dung npm run update de update kb2abot!`
			);
		}
	}
};
