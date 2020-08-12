class Game {
	clear(api, group) {
		delete group.game;
		group.gaming = false;
	}
}

export default Game;
