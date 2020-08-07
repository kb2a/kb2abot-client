import * as COMMANDS from "./commands";
import Manager from "../roles/Manager.js";

class CommandManager extends Manager {
	constructor() {
		super();

		//import
		for (let command in COMMANDS) {
			this.add(new COMMANDS[command]());
		}
	}

	find(keyword) {
		let index = this.items.findIndex(a => {
			if (a.keywords.indexOf(keyword) == -1)
				return false;
			return true;
		});
		return this.items[index];
	}

	add(command) {
		this.items.push(command);
		return this.bottom();
	}
}

export default CommandManager;
