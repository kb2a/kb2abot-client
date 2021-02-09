const Manager = require("./Manager");

module.exports = class CommandManager extends Manager {
	constructor(plugins = {}) {
		super();
		this.import(plugins);
	}

	import(plugins) {
		const checkKeyword = {};
		for (const name in plugins) {
			for (const keyword of plugins[name].keywords) {
				if (checkKeyword[keyword]) {
					console.newLogger.warn(
						`Vui long kiem tra lai keyword cua plugin: ${name}.js va ${checkKeyword[keyword]}.js, bi trung keyword: ${keyword}`
					);
				}
				checkKeyword[keyword] = name;
			}
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
