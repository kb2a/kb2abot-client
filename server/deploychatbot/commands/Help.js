import os from "os";
import Command from "./Command.js";
import {
	isNoParam
} from "../../helper/helperCommand.js";

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
		if (!isNoParam(args))
			return;
		let replyMsg = `Danh sách các câu lệnh: ${os.EOL}`;
		for (const command of _commandManager.items) {
			const tmp = command.keywords.toString().replace(/,/g, " | ") + os.EOL;
			replyMsg += tmp;
		}
		replyMsg += `Nhớ thêm dấu / đằng trước và xài param --help hoặc -h để xem hướng dẫn sử dụng lệnh (vd: /rank --help | /rank -h)${os.EOL}Một số lệnh đặc biệt: ${os.EOL}/switch --chat on: Mở bot autoreply lên${os.EOL}`;
		api.sendMessage(replyMsg, mssg.threadID);
	}
}

export default Help;
