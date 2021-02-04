const Manager = require("./Manager");

module.exports = class GameManager extends Manager {
	constructor(games = {}) {
		super();
		this.import(games);
		this.gameStore = {};
	}

	import(games) {
		for (const name in games) {
			this.add(games[name]);
		}
	}

	findPluginByKeyword(keyword) {
		const index = this.items.findIndex(a => {
			if (a.keywords.indexOf(keyword) == -1) return false;
			return true;
		});
		return this.items[index];
	}

	clean() {

	}
};
