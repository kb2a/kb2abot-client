import {
	log
} from "../../helper/helper.js";
import {
	parseValue
} from "../../helper/helperCommand.js";
import Command from "./Command.js";

class Count extends Command {
	constructor() {
		super({
			keywords: ["count", "dem"],
			help: "[--global | -g] [--id=<memberID> | -i <memberID>]",
			description: "Dùng để đếm tin nhắn của 1 cá nhân hoặc trong cả group (kể từ khi cài bot)"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const global = parseValue(args, ["g", "global"]);
		const id = parseValue(args, ["i", "id"]);

		if (global) {
			const replyMsg = `Tổng số tin nhắn trong group: ${group.messagesCount}`;
			api.sendMessage(replyMsg, mssg.threadID);
			log({
				text: replyMsg,
				icon: "calculator",
				bg: "bg1"
			}, parent);
		}

		if (id) {
			const member = group.memberManager.find(id);
			if (member) {
				const replyMsg = `Tổng số tin nhắn của ${member.name}: ${member.messagesCount}`;
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "calculator",
					bg: "bg1"
				}, parent);
			}
		}
	}
}

export default Count;
