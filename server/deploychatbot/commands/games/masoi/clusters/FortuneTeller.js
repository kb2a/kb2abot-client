import os from "os";
import Cluster from "./Cluster.js";
import {
	symbols
} from "../../../../../helper/helperMaSoi.js";

class FortuneTeller extends Cluster {
	constructor(config) {
		Object.assign(config, {
			role: "FortuneTeller"
		});
		super(config);
	}

	update(body, api, parent, mssg, group, groupManager) {
		const masterGame = groupManager.find(this.masterID, true).game;
		if (this.isDoingObligation) {
			body = parseInt(body);
			if (!isNaN(body) && body >= 1 && body <= masterGame.playerManager.getAlives(true)) {
				const player = masterGame.playerManager.getAlives()[body - 1];
				if (player.id == this.threadID) {
					api.sendMessage("Bạn không thể tự soi chính mình được (mặc dù có thể idk :/)", this.threadID);
				} else {
					api.sendMessage(`Phe của ${player.name} là: ${player.getParty()}`, mssg.threadID);
					this.commit(0);
				}
			}
		}
	}

	doObligation(api, game, timeout) {
		this.reset();
		let passedTime = 0;
		return new Promise(resolve => {
			let checkAnswer = setInterval(() => {
				passedTime += 1000;
				if (passedTime >= timeout) {
					api.sendMessage("Đã hết thời gian, bạn không thể soi ai được nữa!", this.threadID);
					this.commit(0);
				}
				if (this.isCommitted()) {
					clearInterval(checkAnswer);
					resolve(this.getFinalValue());
				}
			}, 1000);

			let replyMsg = `Bạn muốn soi ai ?${os.EOL}`;
			let indexPlayer = 1;
			const players = game.playerManager.getAlives();
			for (const player of players) {
				replyMsg += `${symbols[indexPlayer++]}. ${player.name}(${player.id})${os.EOL}`;
			}
			replyMsg += `Vui lòng nhập số từ (1 - ${players.length})`;
			api.sendMessage(replyMsg, this.threadID);
		});
	}
}

export default FortuneTeller;
