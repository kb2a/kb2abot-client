import os from "os";
import Command from "./Command.js";

class Help extends Command {
	constructor() {
		super({
			keywords: ["help"],
			help: "",
			description: "Dùng để hiển thị tất cả các câu lệnh"
		});
	}

	execute(args, api, parent, mssg, group, _commandManager) {
		super.execute(args, api, parent, mssg, group);
		let replyMsg = `Danh sách các câu lệnh: ${os.EOL}`;
		for (const command of _commandManager.items) {
			const tmp = command.keywords.toString().replace(/,/g, " | ") + os.EOL;
			replyMsg += tmp;
		}
		replyMsg += "Nhớ thêm dấu / đằng trước nữa";
		api.sendMessage(replyMsg, mssg.threadID);
	}
}

export default Help;
