const Manager = require("./Manager.js");

module.exports = class CommandManager extends Manager {
	constructor(plugins = {}) {
		super();
		this.import(plugins);
	}

	import(plugins) {
		for (const name in plugins) {
			this.add(plugins[name]);
		}
	}

	findPluginByKeyword(keyword) {
		const index = this.items.findIndex(a => {
			if (a.keywords.indexOf(keyword) == -1) return false;
			return true;
		});
		return this.items[index];
	}
};
