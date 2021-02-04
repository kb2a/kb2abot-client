const Schema = require("./Schema");

module.exports = class AccountStorageSchema extends Schema {
	constructor(options = {}) {
		super(options);
		Object.assign(this, options);
	}
};
