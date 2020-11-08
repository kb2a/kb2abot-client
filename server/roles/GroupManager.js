const mongoPoolPromise = require("../helper/helperMongo.js");
const Manager = require("./Manager.js");
const Group = require("./Group.js");

module.exports = class GroupManager extends Manager {
	constructor({owner, live = true, listen = true} = {}) {
		super();

		this.owner = owner; // owner là username đã bị encrypt
		this.live = live;
		this.listen = listen;
	}

	downloadFromDtb() {
		return new Promise(async resolve => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("group")
				.find({
					owner: this.owner
				})
				.toArray((error, data) => {
					if (error) throw error;
					if (data.length > 0) {
						for (const group of data) {
							this.add(new Group(group), {
								id: group.id
							});
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
};
