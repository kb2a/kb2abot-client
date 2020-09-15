import os from "os";
import fs from "fs";
import Game from "../Game.js";
import PlayerManager from "./PlayerManager.js";
import Player from "./Player.js";
import Group from "../../../../roles/Group.js";
import * as Clusters from "./clusters";
import {
	data,
	symbols,
	shuffle,
	cloneObject
} from "../../../../helper/helperMaSoi.js";
import {Poll, Item} from "./poll";

const getValueFromRole = (values, role) => {
	let index = values.findIndex(e => e.role == role);
	if (index == -1) return 0;
	return values[index].value;
};

class MaSoi extends Game {
	constructor(config) {
		super(config);
		this.setup;
		this.day = 0;
		this.playerManager = new PlayerManager();
		this.prepairs = ["getWerewolvesGroupID", "getSetup", "rollup", "start"];
		this.tasks = [];

		this.isVotingKill = false;
		this.pollVoteKill = new Poll();
		this.werewolvesGroupID;
		this.lastMessage = "";
	}

	getRoleList(wannaShuffle = false) {
		const out = [];
		for (const role in this.setup) {
			for (let i = 1; i <= this.setup[role]; i++) out.push(role);
		}
		if (wannaShuffle) {
			shuffle(out);
		}
		return out;
	}

	getPlayingAmount(setup) {
		if (!setup) {
			let amount = 0;
			for (const role in this.setup) {
				amount += this.setup[role];
			}
			return amount;
		} else {
			let amount = 0;
			for (const role in setup) {
				amount += setup[role];
			}
			return amount;
		}
	}

	cleanSetup() {
		for (const role in this.setup) {
			if (this.setup[role] <= 0) delete this.setup[role];
		}
	}

	update(body, api, parent, mssg, group, groupManager) {
		if (this.prepairs[0] == "getWerewolvesGroupID") {
			let replyMsg =
				"Vui lòng nhập ID của group dành cho sói (vd: 3026464722744072)";
			if (this.lastMessage != replyMsg)
				api.sendMessage(replyMsg, mssg.threadID);
			this.lastMessage = replyMsg;
			body = Number(body);
			if (!isNaN(body) && body != mssg.threadID)
				api.sendMessage("KB2ABOT - TEST", body, err => {
					if (!err) {
						this.prepairs.splice(0, 1);
						api.sendMessage(
							`Đã set id cho group sói là: ${body} ✅. Chat anything to continue . . .`,
							mssg.threadID
						);
						this.werewolvesGroupID = body;
					}
				});
			return;
		}

		if (this.prepairs[0] == "getSetup") {
			const setups = JSON.parse(
				fs.readFileSync(`${__dirname}/setup.json`)
			);
			let replyMsg = `Vui lòng chọn setup mà bạn muốn (nhập số)${os.EOL}`;
			let indexSetup = 1;
			for (const setup of setups) {
				replyMsg += `${symbols[indexSetup++]}. `;
				for (let role in setup)
					if (setup[role] > 0) replyMsg += `${role}(${setup[role]}) `;
				replyMsg += `✔ ${this.getPlayingAmount(setup)} người${os.EOL}`;
			}
			if (this.lastMessage != replyMsg)
				api.sendMessage(replyMsg, mssg.threadID);
			this.lastMessage = replyMsg;
			body = Number(body);
			if (!isNaN(body) && body >= 1 && body <= setups.length) {
				api.sendMessage(
					`Đã chọn setup: ${body} ✅.${os.EOL} Vào game bằng cách nhắn "meplay"!`,
					mssg.threadID
				);
				this.setup = setups[body - 1];
				this.prepairs.splice(0, 1);
			}
			return;
		}

		if (this.prepairs[0] == "rollup") {
			if (body.toLowerCase().indexOf("meplay") != -1) {
				this.playerManager.add(
					new Player({
						id: mssg.senderID,
						name: group.memberManager.find(mssg.senderID, true).name
					})
				);
				api.sendMessage(
					`Số người chơi sẵn sàng: ${this.playerManager.getLength()}/${this.getPlayingAmount()}`,
					mssg.threadID
				);
			}
			if (this.playerManager.getLength() == this.getPlayingAmount()) {
				// start gaming . . .
				this.prepairs.splice(0, 1);
				this.cleanSetup();
				this.prepairing = false;
				this.day = 1;

				let indexRole = 0;
				const clusters = [];
				const cloneGroup = cloneObject(group); //cluster for MaSoi
				const roles = this.getRoleList(true);

				for (const player of this.playerManager.items) {
					const role = roles[indexRole++];
					player.role = role;
					if (player.getParty() == "Werewolf") continue;

					api.sendMessage(
						"Đây là nơi bạn có thể tương tác với game MaSoi thông qua bot mà không sợ bị lộ role!",
						player.id,
						err => {
							if (err) console.log(err);
							api.sendMessage(
								`Vai trò của bạn là: ${player.role}${
									os.EOL
								}Hướng dẫn: ${
									data[player.getParty()][player.role]
								}`,
								player.id
							);
							groupManager.delete(
								groupManager.find(player.id, true)
							);
							const fakeGroup = groupManager.add(
								new Group(
									Object.assign(cloneGroup, {
										id: player.id,
										gaming: true,
										game: new Clusters[player.role]({
											threadID: player.id,
											masterID: group.id
										})
									})
								)
							);
							clusters.push(fakeGroup.game);
						}
					);
				}

				const wwID = this.werewolvesGroupID;

				(async () => {
					const members = await new Promise(resolve => {
						api.getThreadInfo(wwID, (err, arr) => {
							resolve(arr.participantIDs);
						});
					});
					// debugger;
					for (const memberID of members) {
						if (memberID == api.getCurrentUserID()) return;
						await new Promise(resolve => {
							setTimeout(() => {
								api.removeUserFromGroup(memberID, wwID);
								resolve();
							}, 4000);
						});
					}
				})();

				// thiet lap hang o cho Werewolf
				const werewolves = this.playerManager.getPlayersByParty(
					"Werewolf",
					false,
					true
				); // werewolves
				const werewolvesTimeout = werewolves.length * 4000;
				api.sendMessage(
					`Đã điểm danh xong, vui lòng check tin nhắn của tôi để biết vai trò${
						os.EOL
					}Trò chơi sẽ bắt đầu sau ${werewolvesTimeout /
						1000}s . . .`,
					mssg.threadID
				);
				for (let i = 0; i < werewolves.length; i++)
					setTimeout(() => {
						api.addUserToGroup(werewolves[i], wwID);
					}, 4000 * (i + 1));
				api.sendMessage(
					`Đây là hang ổ của sói.${os.EOL}Phe sói có thể thảo luận tại đây mà không ai biết.`,
					wwID,
					err => {
						if (err) console.log(err);
						api.sendMessage(data.Werewolf.Werewolf, wwID);
						groupManager.delete(groupManager.find(wwID, true));
						const fakeGroup = groupManager.add(
							new Group(
								Object.assign(cloneGroup, {
									id: wwID,
									gaming: true,
									game: new Clusters.Werewolf({
										threadID: wwID,
										masterID: group.id
									})
								})
							)
						);
						// for (const player of this.playerManager.getPlayersByRole("Werewolf")) {
						// 	fakeGroup.game.playerManager.add(player);
						// }
						clusters.push(fakeGroup.game);
					}
				);

				//setup cac tasks
				const deathManager = new PlayerManager();
				const doObligation = () => {
					deathManager.clear();
					api.sendMessage("Đi ngủ đi :/", mssg.threadID);
					return new Promise(resolve => {
						const promiseQueue = [];
						for (const cluster of clusters) {
							if (
								cluster.isAvailable("doObligation") &&
								(cluster.isWerewolfGroup ||
									this.playerManager
										.find(cluster.threadID, true)
										.isAlive())
							) {
								cluster.isDoingObligation = true;
								promiseQueue.push(
									cluster.doObligation(api, this, 60000)
								);
							}
						}
						Promise.all(promiseQueue).then(values => {
							const GuardValue = getValueFromRole(
								values,
								"Guard"
							);
							const WerewolfValue = getValueFromRole(
								values,
								"Werewolf"
							);
							if (
								WerewolfValue != 0 &&
								GuardValue != WerewolfValue
							) {
								const player = this.playerManager.find(
									WerewolfValue,
									true
								);
								player.die();
								deathManager.add(player);
							}
							let replyMsg = `Đêm thứ ${this.day}. . .${os.EOL}`;
							if (
								GuardValue == WerewolfValue &&
								WerewolfValue != 0
							)
								replyMsg += `${
									this.playerManager.find(GuardValue, true)
										.name
								} đã được cứu sống bởi BẢO VỆ!${os.EOL}`;
							const deathAmount = deathManager.getLength();
							if (deathAmount > 0) {
								replyMsg += `Có ${deathAmount} người chết: `;
								for (let i = 0; i < deathAmount; i++) {
									const deathID = deathManager.items[i].id;
									const name = this.playerManager.find(
										deathID,
										true
									).name;
									if (deathAmount > 1) {
										// nhieu nguoi chet
										if (i == deathAmount - 1)
											replyMsg += `và ${name}`;
										else {
											replyMsg += `${name}, `;
										}
									} else {
										// chi co 1 nguoi chet
										replyMsg += name;
									}
								}
							} else {
								replyMsg += "Không có ai chết!";
							}
							api.sendMessage(replyMsg, mssg.threadID);
							resolve();
						});
					});
				};
				const doObligationOnDead = () => {
					return new Promise(resolve => {
						const promiseQueue = [];
						for (const cluster of clusters) {
							if (
								cluster.isAvailable("doObligationOnDead") &&
								cluster.role != "Werewolf" &&
								deathManager.find(cluster.threadID) != -1
							) {
								// khuc nay can xem lai death manager items
								cluster.isDoingObligationOnDead = true;
								promiseQueue.push(
									cluster.doObligationOnDead(api, this, 60000)
								);
							}
						}
						if (promiseQueue.length > 0) {
							api.sendMessage(
								"Vui lòng chờ chức năng những người lúc chết . . .",
								mssg.threadID
							);
							Promise.all(promiseQueue).then(values => {
								const HunterValue = getValueFromRole(
									values,
									"Hunter"
								);
								if (HunterValue == 0) {
									resolve();
								} else {
									api.sendMessage(
										"Đã có thêm người chết!",
										mssg.threadID,
										err => {
											if (err) console.log(err);
											const player = this.playerManager.find(
												HunterValue,
												true
											);
											deathManager.add(player);
											let replyMsg = `${player.name} đã bị bắn bởi THỢ SĂN`;
											player.die();
											api.sendMessage(
												replyMsg,
												mssg.threadID
											);
											deathManager.clear();
											resolve();
										}
									);
								}
							});
						} else {
							resolve();
						}
					});
				};
				const debate = () => {
					return new Promise(resolve => {
						setTimeout(() => {
							api.sendMessage(
								"1 phút tranh luận bắt đầu ._.",
								mssg.threadID
							);
						}, 1000);
						setTimeout(() => {
							resolve();
						}, 60000);
					});
				};
				const voteKill = () => {
					this.pollVoteKill = new Poll();
					for (const player of this.playerManager.getAlives()) {
						this.pollVoteKill.add(
							new Item({
								id: player.id,
								name: player.name
							})
						);
					}
					this.isVotingKill = true;
					return new Promise(resolve => {
						setTimeout(() => {
							let replyMsg = `30 giây để vote treo cổ bắt đầu${os.EOL}`;
							let indexPlayer = 1;
							for (const player of this.playerManager.getAlives()) {
								replyMsg += `${symbols[indexPlayer++]}. ${
									player.name
								} (${this.pollVoteKill
									.find(player.id, true)
									.getAmount()}) ${os.EOL}`;
							}
							api.sendMessage(replyMsg, mssg.threadID);
						}, 1000);
						setTimeout(() => {
							this.isVotingKill = false;
							const finalItem = this.pollVoteKill.getFinalValue();
							if (
								finalItem &&
								finalItem.getAmount() /
									this.playerManager.getAlives(true) >=
									0.25
							) {
								console.log(
									finalItem.getAmount() /
										this.playerManager.getAlives(true)
								);
								const player = this.playerManager.find(
									finalItem.id,
									true
								);
								api.sendMessage(
									`${player.name} đã bị treo cổ >:(`,
									mssg.threadID
								);
								player.die();
							} else {
								api.sendMessage(
									"Sẽ không ai bị giết trong hôm nay :/",
									mssg.threadID
								);
							}
							resolve();
						}, 30000);
					});
				};

				this.tasks.push(debate);
				this.tasks.push(voteKill);
				this.tasks.push(doObligationOnDead);
				this.tasks.push(doObligation); // bắt đầu từ đây
				this.tasks.push(doObligationOnDead);

				// bat dau tro choi
				setTimeout(() => {
					let indexTask = 3;
					const doTask = async () => {
						console.log(this.tasks[indexTask]);
						await this.tasks[indexTask++]();
						if (indexTask > this.tasks.length - 1) {
							indexTask = 0;
							this.day++;
						}
						this.checkEnd(api, mssg, group);
						if (!this.isEnd())
							// if (this.day == 2) {
							// 	this.checkEnd(api, mssg, group);
							// } else
							doTask();
					};
					doTask();
				}, werewolvesTimeout);
			}
			return;
		}

		if (this.prepairs[0] == "start") {
			if (this.isVotingKill) {
				const num = Number(body);
				const voter = this.playerManager.find(mssg.senderID, true);
				if (
					!isNaN(num) &&
					num >= 0 &&
					num <= this.playerManager.getAlives(true) &&
					voter &&
					voter.isAlive()
				) {
					if (num == 0) {
						this.pollVoteKill.unVoteAll(mssg.senderID);
					} else {
						const voteID = this.pollVoteKill.items[num - 1].id;
						this.pollVoteKill.vote(voteID, mssg.senderID);
					}

					let replyMsg = `30 giây để vote treo cổ bắt đầu${os.EOL}${symbols[0]}. Bỏ vote tất cả${os.EOL}`;
					let indexPlayer = 1;
					for (const player of this.playerManager.getAlives()) {
						replyMsg += `${symbols[indexPlayer++]}. ${
							player.name
						} - ${this.pollVoteKill
							.find(player.id, true)
							.getAmount()}${os.EOL}`;
					}
					api.sendMessage(replyMsg, mssg.threadID);
				}
			}
		}
	}

	isEnd() {
		const villagerCount = this.playerManager.getPlayersByParty(
			"Villager",
			true,
			true
		).length;
		const werewolfCount = this.playerManager.getPlayersByParty(
			"Werewolf",
			true,
			true
		).length;
		if (villagerCount <= 0) return "Werewolf";
		if (werewolfCount <= 0) return "Villager";
		if (villagerCount == 1 && werewolfCount >= 1) return "Werewolf";
		return false;
	}

	checkEnd(api, mssg, group) {
		const winner = this.isEnd();
		if (winner) {
			api.sendMessage(
				`Phe ${winner} đã chiến thắng :)))`,
				mssg.threadID,
				err => {
					let replyMsg = `Đây là các role của mọi người: ${os.EOL}`;
					for (const player of this.playerManager.items) {
						replyMsg += `${player.name} - ${player.role}${os.EOL}`;
					}
					api.sendMessage(replyMsg, mssg.threadID);
					if (err) console.log(err);
					api.sendMessage(
						`Đang dọn dẹp game . . . (vui lòng chờ ${4 *
							this.playerManager.getPlayersByParty(
								"Werewolf",
								false,
								true
							).length} giây)`,
						mssg.threadID
					);
				}
			);
			this.clear(api, group);
		}
	}

	clear(api) {
		return new Promise(resolve => {
			const werewolves = this.playerManager.getPlayersByParty(
				"Werewolf",
				false,
				true
			); // werewolves
			if (werewolves.length == 0) resolve();
			for (let i = 0; i < werewolves.length; i++)
				setTimeout(() => {
					api.removeUserFromGroup(
						werewolves[i],
						this.werewolvesGroupID
					);
					if (i == werewolves.length - 1) {
						resolve();
					}
				}, 4000 * (i + 1));
		});
	}
}

export default MaSoi;
