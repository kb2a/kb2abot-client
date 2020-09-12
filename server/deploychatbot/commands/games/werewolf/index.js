import {
	exec
} from "child_process";
import Game from "../Game.js";
import PlayerManager from "./PlayerManager.js";
import Player from "./Player.js";
import Group from "../../../../roles/Group.js";
import Cluster from "./Cluster.js";
import {
	cloneObject
} from "../../../../helper/helperMaSoi.js";
import {
	handleGameOutput
} from "../../../../helper/helperWerewolf.js";

class Werewolf extends Game {
	constructor(config) {
		super(config);
		this.playerManager = new PlayerManager();
		this.playerManager.add(new Player({
			id: this.owner,
			index: 1,
			name: "(thằng tạo game)"
		}));
		this.prepairs = [
			"rollup",
			"start",
			"play"
		];
	}

	update(body, api, parent, mssg, group, groupManager) {
		if (this.prepairs[0] == "rollup") {
			if (body.toLowerCase().indexOf("meplay") != -1) {
				this.playerManager.add(new Player({
					id: mssg.senderID,
					index: this.playerManager.getLength() + 1,
					name: group.memberManager.find(mssg.senderID, true).name
				}));
				api.sendMessage(`Số người chơi sẵn sàng: ${this.playerManager.getLength()}/7`, mssg.threadID);
			}
			if (this.playerManager.getLength() == 7) { // start gaming . . .
				this.prepairs.splice(0, 1);

				const clusters = [];
				const cloneGroup = cloneObject(group); //cluster for MaSoi

				for (const player of this.playerManager.items) {
					groupManager.delete(groupManager.find(player.id, true));
					const fakeGroup = groupManager.add(new Group(Object.assign(cloneGroup, {
						id: player.id,
						gaming: true,
						game: new Cluster({
							threadID: player.id,
							masterID: group.id
						})
					})));
					clusters.push(fakeGroup.game);
				}

				api.sendMessage("Bạn có muốn thêm param nào cho game Werewolf không?", mssg.threadID);
			}
			return;
		}
		if (this.prepairs[0] == "start" && mssg.senderID == this.owner) {
			let players = "";
			for (const player of this.playerManager.items) {
				if (player.id != this.owner)
					players += `${player.index} `;
			}
			// for (let i = 2; i <= 7; i++) {
			// 	players += `${i} `;
			// }
			const query = `werewolf --caller ${this.playerManager.find("id", this.owner, true).index} --tag ${mssg.threadID} start ${body} ${players}`;
			exec(query, (err, stdout) => {
				handleGameOutput(api, mssg, this, err, stdout);
				if (this.prepairs[0] == "start" && !err)
					this.prepairs.splice(0, 1);
			});
			console.log(query);
			return;
		}
		if (this.playerManager.find("id", mssg.senderID) != -1) {
			const query = `werewolf --caller ${this.playerManager.find("id", mssg.senderID, true).index} --tag ${mssg.threadID} ${body}`;
			exec(query, (err, stdout) => {
				handleGameOutput(api, mssg, this, err, stdout);
			});
			console.log(query);
		}
	}

	clear() {
		return new Promise(resolve => {
			resolve(); //idk
		});
	}
}

export default Werewolf;
