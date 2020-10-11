import Command from "./Command.js";
import {hasHelpParam, parseValue} from "../../helper/helperCommand.js";

class Everyone extends Command {
	constructor() {
		super({
			keywords: ["all", "everyone", "everybody"],
			help: "",
			description: "Dùng để gọi hồn tất cả mọi người trong group"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		if (hasHelpParam(args)) return;

		const text = parseValue(args, ["t", "text"]);

		let replyMsg = "";
		const mentions = [];
		for (const member of group.memberManager.items) {
			let tag = `@${member.name} `;
			replyMsg += tag;
			mentions.push({
				tag,
				id: member.id,
				fromIndex: replyMsg.length - tag.length
			});
		}

		api.sendMessage(
			{
				body:
					replyMsg + (typeof text != "undefined" ? ` - ${text}` : ""),
				mentions
			},
			mssg.threadID
		);
	}
}

export default Everyone;
