module.exports = class Thread extends kb2abot.helpers.Manager {
	constructor({id, owner, storage = {}} = {}) {
		super();
		this.id = id;
		this.owner = owner;
		this.isUpdating = false;
		this.storage = {};
	}
};
