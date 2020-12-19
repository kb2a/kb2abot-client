module.exports = class Member {
	constructor({id, owner, messagesCount = 0, name = "Unknown"} = {}) {
		this.id = id;
		this.owner = owner;
		this.messagesCount = messagesCount;
		this.name = name;
		this.storage = {};
	}

	async uploadToDtb() {
		kb2abot.datastore.updateOne(
			{
				id: this.id,
				owner: this.owner
			},
			{
				$set: {
					id: this.id,
					owner: this.owner,
					messagesCount: this.messagesCount,
					name: this.name
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
	// 		dtb.collection("member")
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
