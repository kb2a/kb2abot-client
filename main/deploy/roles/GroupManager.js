const RoleManager = require("./RoleManager.js");
const Group = require("./Group.js");

module.exports = class GroupManager extends RoleManager {
	constructor({} = {}) {
		super();
		this.whitelist = [
			// id group
		]; // cái này để loại bỏ những group mà bạn không muốn bot hoạt động
	}

	async downloadFromDtb() {
		await super.downloadFromDtb("group", Group);
	}

	async downloadAllFromDtb() {
		await this.downloadFromDtb();
		for (const group of this.items) {
			group.memberManager.downloadFromDtb();
		}
	}

	addGroup(id, owner) {
		return this.add(new Group({
			id,
			owner
		}), { id });
	}
};