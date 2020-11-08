const fs = require("fs");
const Manager = require("../roles/Manager.js");
const logger = require("node-color-log");

module.exports = class CommandManager extends Manager {
	constructor() {
		super();
	}

	importCommands() {
		const packageNames = fs
			.readdirSync(__dirname + "/commands")
			.filter(name => name.indexOf(".js") != -1);
		for (const packageName of packageNames) {
			try {
				const Package = require(__dirname + "/commands/" + packageName);
				this.add(new Package());
				logger.info("LOADED: " + packageName);
			} catch (e) {
				logger.error("COULD NOT LOADED: " + packageName);
			}
		}
	}

	findCommandByKeyword(keyword) {
		const index = this.items.findIndex(a => {
			if (a.keywords.indexOf(keyword) == -1) return false;
			return true;
		});
		return this.items[index];
	}
};
