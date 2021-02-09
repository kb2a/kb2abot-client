const Schema = require("./Schema");

module.exports = class ThreadStorageSchema extends Schema {
	constructor(options = {}) {
		super(options);
		const {
			prefix = "/",
			blockTime = 0,
		} = options;
		Object.assign(this, options);
		this.prefix = prefix;
		this.blockTime = blockTime;
	}
};
