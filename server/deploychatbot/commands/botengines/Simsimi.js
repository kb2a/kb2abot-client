import axios from "axios";
import {log} from "../../../helper/helper.js";

function Simsimi(body, api, parent, mssg) {
	log(
		{
			text: `USER: "${body}"`,
			icon: "reply",
			bg: "bg1"
		},
		parent
	);
	axios({
		url: `https://simsimi.copcute.pw/api/sim.php?text=${encodeURI(body)}`,
		method: "GET",
		mode: "no-cors"
	}).then(res => {
		if (res.data.messages[0].text) {
			const replyMsg = res.data.messages[0].text;
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
	});
}

export default Simsimi;
