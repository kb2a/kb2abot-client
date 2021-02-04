const Schema = require("./Schema");

module.exports = class ThreadStorageSchema extends Schema {
	constructor(options = {}) {
		super(options);
		const {
			prefix = "/",
			blockTime = 0,
			game = {}
		} = options;
		Object.assign(this, options);
		this.prefix = prefix;
		this.blockTime = blockTime;
		this.game = game;
	}
};
