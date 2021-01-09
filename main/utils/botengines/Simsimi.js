const axios = require("axios");

module.exports = (api, message) => {
	axios({
		url: `https://sim.cunnobi.xyz/api?text=${encodeURI(message.body)}&format=JSON`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		const replyMsg = /"text":"(.*?)"}/.exec(res.data)[1];
		if (replyMsg)
			api.sendMessage(replyMsg, message.threadID);
	});
};
