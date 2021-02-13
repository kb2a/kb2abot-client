const Manager = require("./Manager");

module.exports = class GameManager extends Manager {
	constructor(options = {}) {
		super();
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
		const item = this.playing(threadID);
		if (item)
			throw new Error(`Game "${item.instance.name}" đang chạy!`);
		item.instance = new this.games[name](param);
	}

	async clean(threadID) {
		const item = this.playing(threadID);
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

	isValid(name) { // check if the game exists
		const game = this.findGameByName(name);
		return game ? true : false;
	}

	isPlaying(threadID) { // check if threadID is already playing a game
		const item = this.find({threadID});
		return item ? true : false;
	}

	playing(threadID) { // get current game name that threadID is playing
		const item = this.find({threadID});
		return item ? item.instance.name : null;
	}
};
