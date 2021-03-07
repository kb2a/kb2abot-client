const axios = require("axios");

module.exports = (api, message) => {
	axios({
		url: `https://api.sfsu.xyz/?text=${encodeURI(message.body)}&format=json&key=kb2abot_sfsu`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		const replyMsg = /"text":"(.*?)"}/.exec(res.data)[1];
		if (replyMsg)
			api.replyMessage(replyMsg, message.threadID);
	});
};
