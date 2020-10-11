import * as COMMAND from "./commands";
import Manager from "../roles/Manager.js";
import logger from "node-color-log";

class CommandManager extends Manager {
	constructor() {
		super();
	}

	importCommands() {
		for (const commandName in COMMAND) {
			try {
				this.add(new COMMAND[commandName]());
				logger.info("LOADED: " + commandName);
			} catch (e) {
				logger.error("COULD NOT LOADED: " + commandName);
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
}

export default CommandManager;
