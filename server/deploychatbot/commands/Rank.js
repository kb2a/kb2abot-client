import {
	log
} from "../../helper/helper.js";
import {
	parseValue
} from "../../helper/helperCommand.js";
import os from "os";
import Command from "./Command.js";

class Rank extends Command {
	constructor() {
		super({
			keywords: "rank",
			help: "[--global | -g] [--id=<memberID> | -i <memberID>] [--upward | -u] [--item=<itemName>]",
			description: "Hiển thị rank hiện tại của 1 cá nhân hoặc tất cả rank của mọi người theo item mà bạn muốn xếp hạng (mặc định là messagesCount)"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);

		const upward = parseValue(args, ["u", "upward"]);
		const global = parseValue(args, ["g", "global"]);
		const id = parseValue(args, ["i", "id"]);
		const item = parseValue(args, ["item"]);

		const sortItem = args.item ? args.item : "messagesCount";

		if (upward) {
			group.sortRank(sortItem, true);
		} else {
			group.sortRank(sortItem, false);
		}

		if (global) {
			let replyMsg = "";
			const listMember = group.memberManager.items;
			const length = listMember.length > 10 ? 10 : listMember.length;
			for (let i = 0; i < length; i++) {
				const {
					name
				} = listMember[i];
				if (!listMember[i].hasOwnProperty(sortItem))
					return;
				replyMsg += `Top ${i+1} là: ${name} (${listMember[i][sortItem]}) ${os.EOL}`;
			}
			api.sendMessage(replyMsg, mssg.threadID);
			log({
				text: replyMsg,
				icon: "sort-amount-up",
				bg: "bg1"
			}, parent);
		}

		if (id) {
			let rank = group.memberManager.find(id);
			if (rank == -1)
				rank = "không có";
			else
				rank++;
			const name = group.memberManager.find(id, true).name;
			const replyMsg = `Rank của ${name} trong group là ${rank}!`;
			api.sendMessage(replyMsg, mssg.threadID);
			log({
				text: replyMsg,
				icon: "sort-amount-up",
				bg: "bg1"
			}, parent);
		}
	}
}

export default Rank;
