const Thread = require("./Thread");

module.exports = class Account extends kb2abot.helpers.Manager {
	constructor({id} = {}) {
		super();
		this.id = id;
		this.storage = {};
	}

	addThread(id) {
		return this.add(
			new Thread({
				id,
				owner: this.id
			}),
			{id}
		);
	}
};
