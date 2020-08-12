import os from "os";
import Cluster from "./Cluster.js";
// import PlayerManager from "../PlayerManager.js";
import {
	symbols
} from "../../../../../helper/helperMaSoi.js";
import {
	Item
} from "../poll";

class Werewolf extends Cluster {
	constructor(config) {
		Object.assign(config, {
			role: "Werewolf",
			isWerewolfGroup: true
		});
		super(config);
		// this.playerManager = new PlayerManager();
	}

	update(body, api, parent, mssg, group, groupManager) {
		const masterGame = groupManager.find(this.masterID, true).game;
		if (this.isDoingObligation) {
			body = parseInt(body);
			if (!isNaN(body) && body >= 0 && body <= this.poll.getLength()) {
				if (body == 0) {
					this.poll.unVoteAll(mssg.senderID);
				} else {
					const voteID = this.poll.items[body - 1].id;
					this.poll.vote(voteID, mssg.senderID);
					const voteItem = this.poll.find(voteID, true);
					if (voteItem.getAmount() >= masterGame.playerManager.getPlayersByRole("Werewolf", true).length) {
						api.sendMessage(`Vì tất cả mọi người đều đã bỏ phiếu nên tối nay ${voteItem.name} sẽ bị chết!`, mssg.threadID);
						this.commit(voteID);
					}
				}
				let replyMsg = `Tình trạng cuộc bỏ phiếu: ${os.EOL}`;
				let indexPlayer = 1;
				for (const item of this.poll.items) {
					replyMsg += `${symbols[indexPlayer++]}. ${item.name} - ${item.getAmount()}${os.EOL}`;
				}
				api.sendMessage(replyMsg, mssg.threadID);
			}
		}
	}

	doObligation(api, game, timeout) {
		this.reset();
		this.resetPoll();
		let passedTime = 0;
		return new Promise(resolve => {
			let checkAnswer = setInterval(() => {
				passedTime += 1000;
				if (passedTime >= timeout) {
					const finalItem = this.poll.getFinalValue();
					if (finalItem) {
						this.commit(finalItem.id);
						api.sendMessage(`Đã hết thời gian, ${finalItem.name} sẽ bị giết >:(`, this.threadID);
					} else {
						this.commit(0);
						api.sendMessage("Đã hết thời gian, không ai sẽ bị giết trong đêm nay!", this.threadID);
					}
				}
				if (this.isCommitted()) {
					clearInterval(checkAnswer);
					resolve(this.getFinalValue());
				}
			}, 1000);

			let replyMsg = `Bạn muốn cắn ai ?${os.EOL}`;
			let indexPlayer = 1;
			for (const player of game.playerManager.getAlives()) {
				replyMsg += `${symbols[indexPlayer++]}. ${player.name}(${player.id})${os.EOL}`;
				this.poll.add(new Item({
					id: player.id,
					name: player.name
				}));
			}
			replyMsg += `Vui lòng nhập số từ (1 - ${this.poll.getLength()})`;
			api.sendMessage(replyMsg, this.threadID);
		});
	}
}

export default Werewolf;
