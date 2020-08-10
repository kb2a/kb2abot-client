import login from "facebook-chat-api";
import {
	parseArg
} from "../helper/helperDeploy.js";
import CommandManager from "./CommandManager.js";
const commandManager = new CommandManager();
const whiteListGroup = [ // phần này để loại bỏ những group mà bạn không muốn bot hoạt động (tránh gây phiền hà)
	// 'whitelist id'
];

function deployChatbot(appState, parent) {
	login({
		appState: JSON.parse(appState)
	}, function(err, api) {

		const {
			groupManager,
			chatbot
		} = parent;

		if (err) return console.log(err);

		// saving cac thu
		parent.appState = JSON.stringify(api.getAppState());
		chatbot.err = err;
		chatbot.api = api;
		// --
		groupManager.downloadAllFromFacebook(api);

		api.listenMqtt(async function(err, mssg) {

			if (!mssg || mssg.threadID == undefined)
				return;

			let {
				threadID,
				senderID,
				body,
				isGroup
			} = mssg;

			if (!body || !isGroup || whiteListGroup.indexOf(threadID) != -1) return;

			body = body.trim();

			const group = groupManager.find(threadID, true, true);

			if (group.updating) // check if is updating . . .
				return;
			if (group.memberManager.items.length == 0) {
				group.downloadFromFacebook(api);
			}

			if (body[0] == "/") { // check if command
				const temp = body.split(" ")[0].split("/");
				const commandName = temp[temp.length - 1]; // lay ten command
				if (commandName) {
					const command = commandManager.find(commandName);
					if (command) {
						if (commandName == "help")
							command.execute(parseArg(body, "א"), api, parent, mssg, group, commandManager);
						else
							command.execute(parseArg(body, "א"), api, parent, mssg, group);
					} else {
						api.sendMessage("Lệnh không xác định!", threadID);
					}
				}
				return;
			} else { // not a command
				group.messagesCount++;
				group.memberManager.find(senderID, true, true).messagesCount++;
				// group.uploadToDtb();
				// group.memberManager.find(senderID, true, true).uploadToDtb();
				if (group.gaming) {
					const validNumber = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];
					if (validNumber.indexOf(body) == -1)
						return;
					const game = group.game.tictactoe;
					const numbers = body.split("");
					game.add(numbers);
					const winner = game.isEnd();
					api.sendMessage(game.getData(), threadID);
					if (winner) {
						api.sendMessage(`${winner} đã chiến thắng :v`, threadID);
						group.gaming = false;
					}
				} else {
					if (group.chat) // bot autoreply is on?
						commandManager.find("autoreply").reply(body, api, parent, mssg);
				}
			}
		});
	});
}

export default deployChatbot;
