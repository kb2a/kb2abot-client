import os from "os";
import {
	log
} from "../../helper/helper.js";
import {
	parseBool,
	parseValue
} from "../../helper/helperCommand.js";
import Command from "./Command.js";

class SwitchStatus extends Command {
	constructor() {
		super({
			keywords: "switch",
			help: "[--<tên giá trị bạn muốn đổi>=<giá trị bạn muốn đổi thành>]",
			description: `Đổi 1 giá trị của group, ví dụ:${os.EOL}--chat on${os.EOL}Nó sẽ đổi giá trị group.chat thành TRUE${os.EOL}Những tên giá trị phổ biến: "chat"(bot mitsuku), "emote"(emoji cho bot mitsuku)`
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		for (const param in args) {
			if (group.hasOwnProperty(param)) {
				const nonParsedBool = parseValue(args, [param]);
				let value;
				if (nonParsedBool === true) {
					value = !group[param];
				} else {
					value = parseBool(nonParsedBool);
				}
				const replyMsg = `${param.toUpperCase()} has changed to [${value}]`;
				group[param] = value;
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "language",
					bg: "bg2"
				}, parent);
			}
		}
	}
}

export default SwitchStatus;
