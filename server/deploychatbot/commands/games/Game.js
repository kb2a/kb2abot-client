class Game {
	constructor({
		owner
	} = {}) {
		this.owner = owner;
	}

	destroy(api, group) {
		delete group.game;
		group.gaming = false;
	}
}

export default Game;
