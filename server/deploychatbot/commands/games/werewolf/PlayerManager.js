import Manager from "../../../../roles/Manager.js";
import Player from "./Player.js";

class PlayerManager extends Manager {
	constructor() {
		super();
	}

	find(name, value, returnPlayer = false, autoAdd = false) {
		let index = this.items.findIndex(e => e[name] == value);
		if (index == -1 && autoAdd) {
			this.add(new Player({
				index: this.getLength() + 1
			}), false);
			index = this.find(name, value);
		}

		if (returnPlayer) {
			return this.items[index];
		}
		return index;
	}

	add(player, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find("id", player.id);
			if (index == -1) {
				this.items.push(player);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(player);
		return this.bottom();
	}
}

export default PlayerManager;
