import mongoPoolPromise from "../helper/helperMongo.js";
import MemberManager from "./MemberManager.js";

class Group {
	constructor({
		id,
		owner,
		location,
		game,
		language = "en",
		chat = false,
		emote = false,
		messagesCount = 0,
		live = true,
		listen = true,
		gaming = false
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
		this.gaming = gaming;
		this.game = game;

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

export default Group;
