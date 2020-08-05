import os from "os";
import {
	parseValue
} from "../../helper/helperCommand.js";

class Command {
	constructor({
		keywords,
		help,
		description
	} = {}) {
		this.keywords = (typeof(keywords) == "object" ? keywords : [keywords]);
		this.help = help;
		this.description = description;
	}

	execute(args, api, parent, mssg, group) {
		const help = parseValue(args, ["help", "h"]);
		if (help) {
			const commandName = args["_"][0];
			api.sendMessage(`Tên câu lệnh: ${commandName}${os.EOL}Miêu tả: ${this.description}${os.EOL}Cách dùng: ${commandName} ${this.help}`, mssg.threadID);
		}
		delete args["_"]; // no need toz use arg._
	}
}

export default Command;
