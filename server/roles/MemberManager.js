const mongoPoolPromise = require("../helper/helperMongo.js");
const Manager = require("./Manager.js");
const Member = require("./Member.js");

module.exports = class MemberManager extends Manager {
	constructor({owner} = {}) {
		super();
		this.owner = owner;
	}

	downloadFromDtb() {
		return new Promise(async resolve => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("member")
				.find({
					owner: this.owner
				})
				.toArray((error, data) => {
					if (error) throw error;
					if (data.length > 0) {
						for (const member of data) {
							this.add(new Member(member), {
								id: member.id
							});
						}
					}
					resolve();
				});
		});
	}
};
