import os from "os";
// import TaiXiu from "./TaiXiu.js";
import TicTacToe from "./TicTacToe.js";
import Command from "../Command.js";

class Game extends Command {
	constructor() {
		super({
			keywords: ["game", "g"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const replyMsg = `Game tictactoe :v  ${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`;
		api.sendMessage(replyMsg, mssg.threadID);
		group.gaming = true;
		group.game.tictactoe = new TicTacToe();
	}
}

export default Game;
