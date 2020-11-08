const os = require("os");
const {log} = require("../../helper/helper.js");
const {hasHelpParam, parseValue} = require("../../helper/helperCommand.js");
const Command = require("./Command.js");

module.exports = class Member extends Command {
	constructor() {
		super({
			keywords: ["member"],
			help: "",
			description: "Dùng để hiển thị tất cả các câu lệnh"
		});
	}

	execute(args, api, parent, mssg, group, _commandManager) {
		super.execute(args, api, parent, mssg, group);
		if (hasHelpParam(args)) return;

		const add = parseValue(args, ["add", "a"]);
		if (add) {
			api.addUserToGroup(add, mssg.threadID);
			log(
				{
					text: `Đã add ${
						group.memberManager.find(
							{
								id: add
							},
							true
						).name
					}(${add}) vào group ${mssg.threadID}`,
					icon: "user-plus",
					bg: "bg2"
				},
				parent
			);
		}
	}
};
