const axios = require("axios");

module.exports = (api, message) => {
	axios({
		url: `https://simsimi.copcute.pw/api/sim.php?text=${encodeURI(message.body)}`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		const replyMsg = res.data.messages[0].text;
		api.sendMessage(replyMsg, message.threadID);
	});
};
