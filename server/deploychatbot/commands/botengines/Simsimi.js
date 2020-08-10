import axios from "axios";
import {
	log
} from "../../../helper/helper.js";

function Simsimi(body, api, parent, mssg) {
	log({
		text: `USER: "${body}"`,
		icon: "reply",
		bg: "bg1"
	}, parent);
	axios({
		"url": `https://simsumi.herokuapp.com/api?text=${encodeURI(body)}&lang=vi`,
		"method": "GET",
		"mode": "no-cors"
	}).then(res => {
		if (res.data.success) {
			const replyMsg = res.data.success;
			api.sendMessage(replyMsg, mssg.threadID);
			log({
				text: `SIMSIMI: "${replyMsg}"`,
				icon: "robot",
				bg: "bg1"
			}, parent);
		}
	});
}

export default Simsimi;
