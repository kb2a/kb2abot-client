const Schema = require('./Schema');

module.exports = class Game extends Schema {
	constructor(options) {
		super(options);
		const {
			name = 'undefined game',
			masterID, // unique
			threadID, // unique
			param = '',
			isGroup = false,
			participants = [masterID]
		} = options;
		this.name = name;
		this.masterID = masterID; // ID người tạo game
		this.threadID = threadID; // ID group để tương tác game
		this.participants = participants;
		this.param = param;
		this.isGroup = isGroup;
	}

	async onMessage() {}

	async clean() {}

	addParticipant(id, duplicateCheck = true) {
		if (duplicateCheck && this.participants.includes(id)) return false;
		this.participants.push(id);
		return true;
	}
};
