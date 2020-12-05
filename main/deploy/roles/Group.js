const Member = require("./Member.js");

module.exports = class Group extends kb2abot.helpers.Manager {
	constructor({id, owner, prefix = "/", messagesCount = 0} = {}) {
		super();
		this.id = id;
		this.owner = owner;
		this.prefix = prefix;
		this.messagesCount = messagesCount;
		this.updating = false;
		this.continuousPluginManager = new kb2abot.helpers.Manager();
	}

	addMember(id, owner) {
		return this.add(
			new Member({
				id,
				owner
			}),
			{id}
		);
	}

	// sortRank(dependent, growing) {
	// 	if (growing) {
	// 		this.memberManager.items.sort(
	// 			(a, b) => a[dependent] - b[dependent]
	// 		);
	// 	} else {
	// 		this.memberManager.items.sort(
	// 			(a, b) => b[dependent] - a[dependent]
	// 		);
	// 	}
	// }

	// checkRank(api, memberID) {
	// 	return new Promise(async resolve => {
	// 		this.sortRank("messagesCount", false);

	// 		const name = (await this.getUserData(api, memberID)).name;

	// 		const indexUser = this.memberManager.find(
	// 			{
	// 				id: memberID
	// 			},
	// 			{
	// 				returnIndex: true
	// 			}
	// 		);
	// 		if (indexUser == -1) {
	// 			resolve({
	// 				name,
	// 				rank: "[không có]"
	// 			});
	// 		} else {
	// 			resolve({
	// 				name,
	// 				rank: indexUser + 1
	// 			});
	// 		}
	// 	});
	// }

	async uploadToDtb() {
		await kb2abot.datastore.updateOne(
			{
				id: this.id
			},
			{
				$set: {
					id: this.id,
					owner: this.owner,
					prefix: this.prefix
				}
			},
			{
				upsert: true
			}
		);
	}

	// getData() {
	// 	return new Promise(async (resolve, reject) => {
	// 		const dtb = await mongoPoolPromise();
	// 		dtb.collection("group")
	// 			.find({
	// 				id: this.id
	// 			})
	// 			.toArray((error, data) => {
	// 				if (error) throw error;
	// 				if (data.length == 1) {
	// 					resolve(data[0]);
	// 				} else {
	// 					reject();
	// 				}
	// 			});
	// 	});
	// }
};
