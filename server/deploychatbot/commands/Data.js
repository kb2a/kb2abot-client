import os from "os";
import Command from "./Command.js";
import {
	parseValue
} from "../../helper/helperCommand.js";

class Data extends Command {
	constructor() {
		super({
			keywords: ["debug", "data"],
			help: "[--item=<itemName> | -i <itemName>] [--global | -g | --all | -a]",
			description: "Cái này dành cho nhà phát triển :v"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const item = parseValue(args, ["item", "i"]);
		const all = parseValue(args, ["all", "global", "a", "g"]);

		if (group.hasOwnProperty(item)) {
			const replyMsg = `\`\`\`${os.EOL}${JSON.stringify(group[item])}${os.EOL}\`\`\``;
			api.sendMessage(replyMsg, mssg.threadID);
		}
		if (all) {
			const replyMsg = `\`\`\`${os.EOL}${JSON.stringify(group)}${os.EOL}\`\`\``;
			api.sendMessage(replyMsg, mssg.threadID);
		}
	}
}

export default Data;
