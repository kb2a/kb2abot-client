import {
	mongoPoolPromise
} from "../chatbot/mongoUtil.js";
import {
	deployChatbot
} from "./chatbot.js";
import vigenere from "vigenere";

class Manager {
	constructor() {
		this.items = [];
		this.updating = false;
	}

	getLength() {
		return this.items.length;
	}

	top() {
		return this.items[0];
	}

	bottom() {
		return this.items[this.items.length - 1];
	}

	delete(item) {
		let index = this.items.indexOf(item);
		this.items.splice(index, 1);
	}
}

class AccountManager extends Manager {
	constructor() {
		super();
	}

	find(username, returnAccount = false) {
		const index = this.items.findIndex(e => {
			e.decrypt();
			const result = e.username == username;
			e.encrypt();
			return result;
		});

		if (returnAccount) {
			return this.items[index];
		}
		return index;
	}

	add(account, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(account.username);
			if (index == -1) {
				this.items.push(account);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(account);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("account").find().toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const account of data) {
						Object.assign(account, {
							encrypted: true
						});
						const tempAcc = this.add(new Account(account));
						tempAcc.deploy();
						// tempAcc.uploadToDtb();
					}
				}
				resolve();
			});
		});
	}
}

class Account {
	constructor({
		dateCreated = Date.now(),
		username,
		secretKey,
		appState,
		encrypted = false
	} = {}) {
		this.dateCreated = dateCreated;
		this.username = username;
		this.secretKey = secretKey;
		this.encrypted = encrypted;
		this.appState = appState;

		this.chatbot = {
			logs: [],
			queue: [],
			tempMusicsInfo: []
		};

		this.encrypt();
		this.groupManager = new GroupManager({
			owner: this.username
		});
		// this.groupManager.downloadFromDtb().then(() => {});
	}

	deploy() {
		this.decrypt();
		deployChatbot(this.appState, this);
	}

	logout() {
		if (this.chatbot.api) {
			this.chatbot.api.logout();
		}
	}

	encrypt() {
		if (this.encrypted) {
			return;
		}
		this.username = vigenere.encode(this.username, this.secretKey);
		this.appState = vigenere.encode(this.appState, this.secretKey);
		this.encrypted = true;
	}

	decrypt() {
		if (!this.encrypted) {
			return;
		}
		this.username = vigenere.decode(this.username, this.secretKey);
		this.appState = vigenere.decode(this.appState, this.secretKey);
		this.encrypted = false;
	}

	async uploadToDtb() {
		this.encrypt();

		const dtb = await mongoPoolPromise();
		dtb.collection("account").updateOne({
			username: this.username
		}, {
			$set: {
				username: this.username,
				appState: this.appState,
				secretKey: this.secretKey,
				dateCreated: this.dateCreated
			}
		}, {
			upsert: true
		});
	}

	getData() {
		this.encrypt();
		return new Promise(async (resolve, reject) => {
			const dtb = await mongoPoolPromise();
			dtb.collection("account").find({
				username: this.username
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length == 1) {
					resolve(data[0]);
				} else {
					reject();
				}
			});
		});
	}
}

class GroupManager extends Manager {
	constructor({
		owner,
		live = true,
		listen = true
	} = {}) {
		super();

		this.owner = owner; // owner là username đã bị encrypt
		this.live = live;
		this.listen = listen;
	}

	find(id, returnGroup = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Group({
				id,
				owner: this.owner
			}), false);
			index = this.find(id);
		}

		if (returnGroup) {
			return this.items[index];
		}
		return index;
	}

	add(group, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(group.id);
			if (index == -1) {
				this.items.push(group);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(group);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("group").find({
				owner: this.owner
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const group of data) {
						this.add(new Group(group));
					}
				}
				resolve();
			});
		});
	}

	downloadAllFromFacebook(api) {
		for (const group of this.items) {
			group.downloadFromFacebook(api);
		}
	}
}

class Group {
	constructor({
		id,
		owner,
		location,
		language = "en",
		chat = false,
		emote = false,
		messagesCount = 0,
		live = true,
		listen = true
	} = {}) {
		this.id = id;
		this.language = language;
		this.chat = chat;
		this.emote = emote;
		this.messagesCount = messagesCount;
		this.location = location;
		this.updating = false; // no database structure
		this.live = live;
		this.listen = listen;
		this.gaming = false;
		this.game = {};

		this.owner = owner;

		this.memberManager = new MemberManager({
			owner: this.id
		});
		// this.memberManager.downloadFromDtb().then(() => {});
	}

	async downloadFromFacebook(api) {
		const users = await new Promise(resolve => {
			api.getThreadInfo(this.id, (err, arr) => {
				resolve(arr.participantIDs);
			});
		});

		for (const userID of users) {
			let member = this.memberManager.find(userID, true, true);
			api.getUserInfo(userID, (error, ret) => {
				if (error) throw error;
				for (let i in ret) {
					if (i == userID) {
						return Object.assign(member, ret[i]);
					}
				}
			});
		}

	}

	sortRank(dependent, growing) {
		if (growing) {
			this.memberManager.items.sort((a, b) => a[dependent] - b[dependent]);
		} else {
			this.memberManager.items.sort((a, b) => b[dependent] - a[dependent]);
		}
	}

	checkRank(api, userID) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async resolve => {
			this.sortRank("messagesCount", false);

			const name = (await this.getUserData(api, userID)).name;

			const indexUser = this.memberManager.find(userID, false, true);
			if (indexUser == -1) {
				resolve({
					name,
					rank: "[không có]"
				});
			} else {
				resolve({
					name,
					rank: indexUser + 1
				});
			}
		});
	}

	async uploadToDtb() {
		const dtb = await mongoPoolPromise();
		dtb.collection("group").updateOne({
			id: this.id
		}, {
			$set: {
				id: this.id,
				language: this.language,
				chat: this.chat,
				emote: this.emote,
				messagesCount: this.messagesCount,
				location: this.location,
				live: this.live,
				listen: this.listen,
				owner: this.owner
			}
		}, {
			upsert: true
		});
	}

	getData() {
		return new Promise(async (resolve, reject) => {
			const dtb = await mongoPoolPromise();
			dtb.collection("group").find({
				id: this.id
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length == 1) {
					resolve(data[0]);
				} else {
					reject();
				}
			});
		});
	}
}

class MemberManager extends Manager {
	constructor({
		owner
	} = {}) {
		super();
		this.owner = owner;
	}

	find(id, returnMember = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Member({
				id,
				owner: this.owner
			}), false);
			index = this.find(id);
		}

		if (returnMember) {
			return this.items[index];
		}
		return index;
	}

	add(member, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(member.id);
			if (index == -1) {
				this.items.push(member);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(member);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("member").find({
				owner: this.owner
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const member of data) {
						this.add(new Member(member));
					}
				}
				resolve();
			});
		});
	}
}

class Member {
	constructor({
		id,
		owner,
		messagesCount = 0,
		name = "Unknown"
	}) {
		this.id = id;
		this.name = name;
		this.messagesCount = messagesCount;

		this.owner = owner;
	}

	async uploadToDtb() {
		const dtb = await mongoPoolPromise();
		dtb.collection("member").updateOne({
			id: this.id,
			owner: this.owner
		}, {
			$set: {
				id: this.id,
				name: this.name,
				messagesCount: this.messagesCount,
				owner: this.owner
			}
		}, {
			upsert: true
		});
	}

	getData() {
		return new Promise(async (resolve, reject) => {
			const dtb = await mongoPoolPromise();
			dtb.collection("member").find({
				id: this.id
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length == 1) {
					resolve(data[0]);
				} else {
					reject();
				}
			});
		});
	}
}

export {
	Manager,
	AccountManager,
	Account,
	GroupManager,
	Group,
	MemberManager,
	Member
};
