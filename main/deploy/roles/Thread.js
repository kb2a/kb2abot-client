module.exports = class Group extends kb2abot.helpers.Manager {
	constructor({id, owner} = {}) {
		super();
		this.id = id;
		this.owner = owner;
		this.isUpdating = false;
		this.storage = {};
	}
};
