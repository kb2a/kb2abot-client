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

/*
case "add": {
	let userID = params[0];
	api.addUserToGroup(userID, threadID);
	log({
		text: `Đã add ${group.memberManager.find(userID, true).name}(${userID}) vào group ${threadID}`,
		icon: "user-plus",
		bg: "bg2"
	}, parent);
	break;
}

case "delete": {
	let userID = params[0];
	if (userID == "100052638460826" || userID == "100007723935647")
		return;
	api.removeUserFromGroup(userID, threadID);
	log({
		text: `Đã xóa ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}`,
		icon: "user-minus",
		bg: "bg2"
	}, parent);
	break;
}

case "mute": {
	let time = params[1];
	if (time <= 0)
		time = 1;
	let userID = params[0];
	let reason = params[2];
	let tempFunc = () => {
		ExecuteCommand("delete", [userID], mssg, group);
		setTimeout(() => {
			ExecuteCommand("add", [userID], mssg, group);
		}, time * 1000);
	};
	if (reason) {
		sendMessage({
			text: `Bị khóa mõm vì lí do: ${reason}${os.EOL}Thời gian lãnh án: ${time} giây!`,
			threadID
		}, tempFunc);
		log({
			text: `Đã mute user ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}, lí do: ${reason}`,
			icon: "comment-slash",
			bg: "bg2"
		}, parent);
	} else {
		tempFunc();
	}
	break;
}

*/
