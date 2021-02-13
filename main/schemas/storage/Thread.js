const Storage = require("./Storage");

module.exports = class ThreadStorageSchema extends Storage {
	constructor(options = {}) {
		super(options);
		const {
			prefix = "/",
			blockTime = 0,
		} = options;
		this.prefix = prefix;
		this.blockTime = blockTime;
	}
};
