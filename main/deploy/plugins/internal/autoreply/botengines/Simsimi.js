const axios = require('axios');

module.exports = async (message, reply) => {
	const res = await axios({
		url: `https://api.simsimi.net/v1/?text=${encodeURI(message.body)}`,
		method: 'GET'
	});
	reply(res.data.success);
};
