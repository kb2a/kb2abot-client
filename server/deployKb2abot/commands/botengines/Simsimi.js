const axios = require("axios");
const {log} = require("../../../helper/helper.js");

module.exports = (body, api, parent, mssg) => {
	log(
		{
			text: `USER: "${body}"`,
			icon: "reply",
			bg: "bg1"
		},
		parent
	);
	axios({
		url: `http://sim.cunnobi.xyz/api/?text=${encodeURI(body)}&format=TEXT`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		try {
			const jsonP = JSON.parse(/{(.*?)}/.exec(res.data)[0]);
			if (jsonP.code == "0") {
				const replyMsg = jsonP.text;
				api.sendMessage(replyMsg, mssg.threadID);
				log(
					{
						text: `SIMSIMI: "${replyMsg}"`,
						icon: "robot",
						bg: "bg1"
					},
					parent
				);
			} else {
				const replyMsg = "Hong hỉu bạn nói j á :<";
				api.sendMessage(replyMsg, mssg.threadID);
				log(
					{
						text: `SIMSIMI: "${replyMsg}"`,
						icon: "robot",
						bg: "bg1"
					},
					parent
				);
			}
		}
		catch(e) {
			console.log("Loi simsimi!");
		}
	});
};
