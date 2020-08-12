import Manager from "../../../../roles/Manager.js";
import Player from "./Player.js";

class PlayerManager extends Manager {
	constructor() {
		super();
	}

	getPlayersByParty(party, aliveOnly = true, returnIDs = false) {
		const out = [];
		for (const player of this.items) {
			if (player.getParty() == party) {
				if (aliveOnly) {
					if (player.isAlive()) {
						if (returnIDs) {
							out.push(player.id);
						} else {
							out.push(player);
						}
					}
				} else {
					if (returnIDs) {
						out.push(player.id);
					} else {
						out.push(player);
					}
				}
			}
		}
		return out;
	}

	getPlayersByRole(role, returnIDs = false) {
		const out = [];
		for (const player of this.items) {
			if (player.role == role) {
				if (returnIDs) {
					out.push(player.id);
				} else {
					out.push(player);
				}
			}
		}
		return out;
	}

	find(id, returnPlayer = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Player({
				id
			}), false);
			index = this.find(id);
		}

		if (returnPlayer) {
			return this.items[index];
		}
		return index;
	}

	add(player, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(player.id);
			if (index == -1) {
				this.items.push(player);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(player);
		return this.bottom();
	}

	getAlives(returnAmount) {
		const out = [];
		for (const player of this.items) {
			if (!player.dead)
				out.push(player);
		}
		if (returnAmount)
			return out.length;
		return out;
	}
}

export default PlayerManager;
