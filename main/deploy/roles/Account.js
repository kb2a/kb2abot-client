const Group = require("./Group");

module.exports = class Account extends kb2abot.helpers.Manager {
	constructor({id} = {}) {
		super();
		this.id = id;
		this.storage = {};
	}

	addGroup(id, owner) {
		return this.add(
			new Group({
				id,
				owner
			}),
			{id}
		);
	}

	// async uploadToDtb() {
	// 	await kb2abot.datastore.updateOne(
	// 		{
	// 			id: this.id
	// 		},
	// 		{
	// 			$set: {
	// 				id: this.id,
	// 				owner: this.owner,
	// 				prefix: this.prefix
	// 			}
	// 		},
	// 		{
	// 			upsert: true
	// 		}
	// 	);
	// }

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
