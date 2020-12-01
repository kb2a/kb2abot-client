const { mongoPoolPromise, Manager } = kb2abot.helpers;

module.exports = class RoleManager extends Manager {
	constructor({ owner } = {}) {
		super();
		this.owner = owner;
		this.updating = false;
	}

	
};