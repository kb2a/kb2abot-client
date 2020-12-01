const RoleManager = require("./RoleManager.js");
const Member = require("./Member.js");

module.exports = class MemberManager extends RoleManager {
	constructor({} = {}) {
		super();
	}

	async downloadFromDtb() {
		await super.downloadFromDtb("member", Member);
	}

	addMember(id, owner) {
		return this.add(new Member({
			id,
			owner
		}), { id });
	}
};
