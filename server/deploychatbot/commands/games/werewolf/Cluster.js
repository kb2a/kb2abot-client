import os from "os";
import {
	exec
} from "child_process";
import {
	symbols
} from "../../../../helper/helperMaSoi.js";
import {
	handleGameOutput
} from "../../../../helper/helperWerewolf.js";

class Cluster {
	constructor({
		threadID,
		masterID
	} = {}) {
		this.threadID = threadID;
		this.masterID = masterID;
	}

	update(body, api, parent, mssg, group, groupManager) {
		const masterGame = groupManager.find(this.masterID, true).game;
		if (body.toLowerCase().indexOf("list") != -1) {
			let replyMsg = `Danh sách id các người chơi còn sống:${os.EOL}`;
			for (const player of masterGame.playerManager.items) {
				replyMsg += `${symbols[player.index]}. ${player.name}`;
			}
			api.sendMessage(replyMsg, mssg.threadID);
			return;
		}
		const query = `werewolf --caller ${masterGame.playerManager.find("id", mssg.senderID, true).index} --tag ${this.masterID} ${body}`;
		exec(query, (err, stdout) => {
			handleGameOutput(api, mssg, masterGame, err, stdout);
		});
		console.log(query);
	}
}

export default Cluster;
