import os from "os";
import * as Games from "./games";
import {
	parseValue
} from "../../helper/helperCommand.js";
import Command from "./Command.js";

class Game extends Command {
	constructor() {
		super({
			keywords: ["game", "g"],
			help: "[--name=<gameName> | -n <gameName>] [--list | -l] [--suspend | -s]",
			description: "Chơi game, xài -l để hiển thị các game :| và bạn có thể buộc nó tắt bằng cách /game -s"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const name = parseValue(args, ["name", "n"]);
		const list = parseValue(args, ["list", "l"]);
		const suspend = parseValue(args, ["suspend", "s"]);
		if (list) {
			let replyMsg = "List các game: ";
			for (let gameName in Games) {
				replyMsg += `${os.EOL}${gameName}`;
			}
			api.sendMessage(replyMsg, mssg.threadID);
		}

		if (name) {
			if (group.game) {
				api.sendMessage("Đang chạy 1 game, bạn có thể buộc nó tắt bằng cách /game -s", mssg.threadID);
				return;
			}
			if (Games.hasOwnProperty(name)) {
				group.game = new Games[name];
				group.gaming = true;
				const replyMsg = `Đã khởi tạo trò ${name} thành công!`;
				api.sendMessage(replyMsg, mssg.threadID);
			} else {
				const replyMsg = `Không tìm thấy game nào có tên: ${name}`;
				api.sendMessage(replyMsg, mssg.threadID);
			}
		}

		if (suspend) {
			delete group.game;
			group.gaming = false;
			api.sendMessage("Game died :/", mssg.threadID);
		}
		// const replyMsg = `Game tictactoe :v  ${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`;
		// group.gaming = true;
		// group.game.tictactoe = new TicTacToe();
	}
}

export default Game;
