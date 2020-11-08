const os = require("os");
const logger = require("node-color-log");
const {parseValue} = require("../../helper/helperCommand.js");
const BotEngines = require("./botengines");
const Command = require("./Command.js");

module.exports = class AutoReply extends Command {
	constructor() {
		super({
			keywords: ["autoreply", "auto"],
			help: "[--engine=<engineName> | -e <engineName>]",
			description: `Dùng để bật auto-reply cho group, default là engine 'simsimi'.${os.EOL}Các engineName: simsimi, mitsuku.`
		});
		this.engine = "Mitsuku";
	}

	fixEngineName(text) {
		let lower = text.toLowerCase();
		return lower.charAt(0).toUpperCase() + lower.slice(1);
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const engine = parseValue(args, ["e", "t"]);
		if (engine) {
			if (group.chat == false) {
				api.sendMessage(
					"Bạn chưa bật chat cho group, vui lòng sử dụng lệnh: /switch --chat on",
					mssg.threadID
				);
			} else {
				const fixedEngineName = this.fixEngineName(engine);
				if (BotEngines.hasOwnProperty(fixedEngineName)) {
					this.engine = fixedEngineName;
					api.sendMessage(
						`Đã chuyển xài engine: ${fixedEngineName}`,
						mssg.threadID
					);
				} else {
					api.sendMessage(
						`Không tìm thấy engine nào có tên: ${fixedEngineName}`,
						mssg.threadID
					);
				}
			}
		}
	}

	reply(body, api, parent, mssg) {
		try {
			BotEngines[this.engine](body, api, parent, mssg);
		} catch (e) {
			logger.error("ERROR WHILE PROCESSING THE BOTCHAT!");
		}
	}
};
