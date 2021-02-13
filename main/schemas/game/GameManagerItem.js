const Schema = require("../Schema");

module.exports = class GameManagerItem extends Schema {
	constructor(options) {
		super(options);
		const {threadID} = options;
		this.threadID = threadID;
		this.instance = {};
	}
};
