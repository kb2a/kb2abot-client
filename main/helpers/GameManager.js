const Manager = require("./Manager");

module.exports = class GameManager extends Manager {
	constructor(options) {
		super(options);
		const {games = {}} = options;
		this.games = games;
	}

	import(games, clear = false) {
		if (clear)
			this.games = games;
		else
			Object.assign(this.games, games);
	}

	run(name, {threadID, param} = {}) {
		if (this.isPlaying(threadID))
			throw new Error(`Game "${this.running()}" đang chạy!`);
		this.instance = new this.games[name](param);
	}

	async clean(threadID) {
		const item = this.find({id: threadID});
		if (item) {
			try {
				await item.instance.clean();
			}
			finally {
				this.instance = {};
			}	
		}
	}

	findGameByName(name) {
		const game = this.games[name];
		return game ? game : null;
	}

	isValid(name) { // check if game exists
		const game = this.findGameByName(name);
		return game ? true : false;
	}

	isPlaying(threadID) { // check if already playing a game
		const item = this.find({id: threadID});
		return item ? true : false;
	}

	playing(threadID) { // get current game name is playing
		const item = this.find({id: threadID});
		return item ? item.instance.name : null;
	}
};
