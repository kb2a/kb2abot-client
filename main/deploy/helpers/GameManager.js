const Manager = require('./Manager');

module.exports = class GameManager extends Manager {
	constructor(games) {
		super();
		this.games = games;
	}

	import(games, clear = false) {
		if (clear) this.games = games;
		else Object.assign(this.games, games);
	}

	run(name, gameOptions) {
		for (const item of this.items) {
			if (item.threadID == gameOptions.threadID)
				throw new Error(`Blocked! Box đang chạy trò chơi: ${item.name}!`);
			if (item.participants.includes(gameOptions.masterID))
				throw new Error(`Blocked! Bạn đang chơi trò chơi: ${item.name}!`);
		}
		this.add(new this.games[name](gameOptions));
	}

	async clean(threadID) {
		const item = this.find({threadID});
		if (item) {
			try {
				await item.clean();
			} finally {
				this.delete({threadID});
			}
		}
	}

	findGameByName(name) {
		const game = this.games[name];
		return game ? game : null;
	}

	isValid(name) {
		// check if the game exists
		const game = this.findGameByName(name);
		return game ? true : false;
	}

	isPlaying(threadID) {
		// check if threadID is already playing a game
		const item = this.find({threadID});
		return item ? true : false;
	}

	playing(threadID) {
		// get current item that threadID is playing
		const item = this.find({threadID});
		return item ? item : null;
	}

	getList() {
		const list = [];
		for (const name in this.games) {
			list.push(name);
		}
		return list;
	}
};
