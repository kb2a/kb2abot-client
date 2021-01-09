const axios = require("axios");

module.exports = (api, message) => {
	axios({
		url: `http://api.simsimi.net/v1/?text=${encodeURI(message.body)}&lang=vi`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		const replyMsg = res.data.messages[0].response;
		api.sendMessage(replyMsg, message.threadID);
	});
};
