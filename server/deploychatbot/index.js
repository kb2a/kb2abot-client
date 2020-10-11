import login from "facebook-chat-api";
import {parseArg} from "../helper/helperDeploy.js";
import {Group, Member} from "../roles/";
import CommandManager from "./CommandManager.js";
const commandManager = new CommandManager();
commandManager.importCommands(); // import all commands
const whiteListGroup = [
	// phần này để loại bỏ những group mà bạn không muốn bot hoạt động (tránh gây phiền hà)
	// 'whitelist id'
];

function deployChatbot(appState, parent) {
	login(
		{
			appState: JSON.parse(appState)
		},
		function(err, api) {
			const {groupManager, chatbot} = parent;

			if (err) return console.log(err);

			// saving cac thu
			parent.appState = JSON.stringify(api.getAppState());
			chatbot.err = err;
			chatbot.api = api;
			// --
			groupManager.downloadAllFromFacebook(api);

			api.listenMqtt(async function(err, mssg) {
				if (!mssg || mssg.threadID == undefined) return;

				let {threadID, senderID, body} = mssg;

				if (!body || whiteListGroup.indexOf(threadID) != -1) return;

				body = body.trim();

				const group = groupManager.add(
					// xem lai khuc nay, debug xem no co thuc su add vo ko
					new Group({
						id: threadID
					}),
					{id: threadID}
				);

				if (group.updating)
					// check if is updating . . .
					return;
				if (group.memberManager.items.length == 0) {
					group.downloadFromFacebook(api);
					return;
					// return api.sendMessage(
					// 	"Đang cập nhật dữ liệu . . .",
					// 	mssg.threadID
					// );
				}

				if (body[0] == "/") {
					// check if command
					const temp = body.split(" ")[0].split("/");
					const commandName = temp[temp.length - 1]; // lay ten command
					if (commandName) {
						const command = commandManager.findCommandByKeyword(
							commandName
						); // find cua classs CommandManager khac voi class Manager
						if (command) {
							// found command!
							if (commandName == "help")
								command.execute(
									parseArg(body, "א"),
									api,
									parent,
									mssg,
									group,
									commandManager
								);
							else
								command.execute(
									parseArg(body, "א"),
									api,
									parent,
									mssg,
									group
								);
						} else {
							api.sendMessage("Lệnh không xác định!", threadID);
						}
					}
					return;
				} else {
					// not a command
					group.messagesCount++;
					const member = group.memberManager.add(
						new Member({
							id: senderID,
							owner: threadID
						}),
						{id: senderID}
					);
					member.messagesCount++;
					// group.uploadToDtb();
					// group.memberManager.find(senderID, true, true).uploadToDtb();
					if (group.gaming) {
						group.game.update(
							body,
							api,
							parent,
							mssg,
							group,
							groupManager
						);
					} else {
						if (group.chat)
							// bot autoreply is on?
							commandManager
								.findCommandByKeyword("autoreply")
								.reply(body, api, parent, mssg);
					}
				}
			});
		}
	);
}

export default deployChatbot;
