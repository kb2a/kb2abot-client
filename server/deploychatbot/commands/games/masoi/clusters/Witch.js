import os from "os";
import Cluster from "./Cluster.js";
import {
	symbols
} from "../../../../../helper/helperMaSoi.js";

class Witch extends Cluster {
	constructor(config) {
		Object.assign(config, {
			role: "Witch"
		});
		super(config);
		this.pinnedID = 0;
	}

	update(body, api, parent, mssg, group, groupManager) {
		const masterGame = groupManager.find(this.masterID, true).game;
		if (this.isDoingObligation || this.isDoingObligationOnDead) {
			body = parseInt(body);
			if (!isNaN(body) && body >= 1 && body <= masterGame.playerManager.getAlives(true)) {
				const player = masterGame.playerManager.getAlives()[body - 1];
				if (player.id == this.threadID) {
					api.sendMessage("Bạn không thể tự ghim chính mình được (mặc dù có thể idk :/)", this.threadID);
				} else {
					api.sendMessage(`Bạn đã ghim ${player.name}!`, mssg.threadID);
					this.pinnedID = player.id;
					this.commit(player.id);
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
					api.sendMessage("Đã hết thời gian, bạn không thể ghim ai được nữa!", this.threadID);
					this.commit(0);
				}
				if (this.isCommitted()) {
					clearInterval(checkAnswer);
					resolve(this.getFinalValue());
				}
			}, 1000);

			let replyMsg = `Bạn muốn giết ai ${os.EOL}`;
			let indexPlayer = 1;
			for (const player of game.playerManager.getAlives()) {
				replyMsg += `${symbols[indexPlayer++]}. ${player.name}(${player.id})${os.EOL}`;
			}
			replyMsg += `Vui lòng nhập số từ (1 - ${game.playerManager.getAlives(true)})`;
			api.sendMessage(replyMsg, this.threadID);
		});
	}

	doObligationOnDead() {
		this.reset();
		return new Promise(resolve => {
			this.commit(this.pinnedID);
			resolve(this.getFinalValue());
		});
	}
}

export default Witch;
