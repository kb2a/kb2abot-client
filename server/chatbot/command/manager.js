import * as COMMANDS from "./commands.js";

class Manager {
	constructor() {
		this.items = [];
		this.updating = false;
	}

	getLength() {
		return this.items.length;
	}

	top() {
		return this.items[0];
	}

	bottom() {
		return this.items[this.items.length - 1];
	}

	delete(item) {
		let index = this.items.indexOf(item);
		this.items.splice(index, 1);
	}
}

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
