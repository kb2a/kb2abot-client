import os from "os";
import Cluster from "./Cluster.js";
import {
	symbols
} from "../../../../../helper/helperMaSoi.js";

class Guard extends Cluster {
	constructor(config) {
		Object.assign(config, {
			role: "Guard"
		});
		super(config);
		this.selfProtected = false;
	}

	update(body, api, parent, mssg, group, groupManager) {
		const masterGame = groupManager.find(this.masterID, true).game;
		if (this.isDoingObligation) {
			body = parseInt(body);
			if (!isNaN(body) && body >= 1 && body <= masterGame.playerManager.getAlives(true)) {
				const choice = masterGame.playerManager.getAlives()[body - 1];
				if (choice.id == this.threadID) {
					if (!this.selfProtected) {
						this.selfProtected = true;
						api.sendMessage("Bạn đã bảo vệ chính mình", mssg.threadID);
						this.commit(choice.id);
					} else {
						api.sendMessage("[rejected] Bạn đã bảo vệ chính mình đêm trước!", mssg.threadID);
					}
				} else {
					this.selfProtected = false;
					api.sendMessage(`Đã bảo vệ: ${choice.name}`, mssg.threadID);
					this.commit(choice.id);
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
					api.sendMessage("Đã hết thời gian, sẽ không ai được bảo vệ trong đêm nay!", this.threadID);
					this.selfProtected = false;
					this.commit(0);
				}
				if (this.isCommitted()) {
					clearInterval(checkAnswer);
					resolve(this.getFinalValue());
				}
			}, 1000);

			let replyMsg = `Bạn muốn bảo vệ ai ?${os.EOL}`;
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

export default Guard;
