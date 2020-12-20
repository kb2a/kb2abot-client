import Manager from "../../../../roles/Manager.js";

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

	getAlives(returnAmount) {
		const out = [];
		for (const player of this.items) {
			if (!player.dead) out.push(player);
		}
		if (returnAmount) return out.length;
		return out;
	}
}

export default PlayerManager;
