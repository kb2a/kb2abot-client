const axios = require('axios');

module.exports = async (message, reply) => {
	const res = await axios({
		url: `https://simsumi.herokuapp.com/api?text=${encodeURI(message.body)}`,
		method: 'GET'
	});
	reply(res.data.success);
};
