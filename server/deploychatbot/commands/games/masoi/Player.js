import {
	getParty
} from "../../../../helper/helperMaSoi.js";

class Player {
	constructor({
		id,
		name,
		role
	} = {}) {
		this.id = id;
		this.name = name;
		this.role = role;
		this.dead = false;
	}

	die() {
		this.dead = true;
	}

	getParty() {
		return getParty(this.role);
	}

	isAlive() {
		return !this.dead;
	}
}

export default Player;
