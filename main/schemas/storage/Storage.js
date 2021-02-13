const Schema = require("../Schema");

module.exports = class Storage extends Schema {
	constructor(options = {}) {
		super(options);
		Object.assign(this, options);
	}

	extend(storage) {
		Object.assign(this, storage);
	}
};
