import mongoPoolPromise from "../helper/helperMongo.js";

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

export default Member;
