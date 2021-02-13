const Schema = require("../Schema");

module.exports = class GameSchema extends Schema {
	constructor(options = {}) {
		super(options);
		const {
			name = "undefined game",
			masterID,
			threadID,
			participants = []
		} = options;
		this.name = name;
		this.masterID = masterID;
		this.threadID = threadID;
		this.participants = participants;
	}

	async onMessage() {

	}
};
