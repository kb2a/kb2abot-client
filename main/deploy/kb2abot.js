const os = require("os");
const login = require("facebook-chat-api");

// import all plugin into pluginManager
const pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);
const { parseArg } = kb2abot.utils;

module.exports = appState => {
	login({
			appState: JSON.parse(appState)
		},
		function(err, api) {

			if (err) return console.log(err);

			// kb2abot.groupManager.downloadAllFromDtb();


			api.listenMqtt(async function(err, message) {
				if (!message || message.threadID == undefined) return;
				let { threadID, senderID, body } = message;
				if (!body) return;
				body = body.trim();

				const group = kb2abot.groupManager.addGroup(threadID, kb2abot.id);

				if (group.updating)
					// check if is updating . . .
					return;

				// if (group.memberManager.items.length == 0) {
				// 	// group.downloadAllFromDtb();
				// 	return;
				// 	// return api.sendMessage(
				// 	// 	"Đang cập nhật dữ liệu . . .",
				// 	// 	message.threadID
				// 	// );
				// }

				if (body.toLowerCase() == "prefix") {
					return api.sendMessage(
						`Prefix hiện tại của group là:${os.EOL}${group.prefix}`,
						message.threadID
					);
				}

				if (body.toLowerCase().indexOf("prefix ") == 0) {
					const tmp = body.split(" ");
					if (tmp.length > 2) {
						return api.sendMessage(
							`Sai cú pháp prefix!${os.EOL}prefix <prefix mà bạn muốn đặt>`,
							message.threadID
						);
					}
					group.prefix = tmp[1];
					let replyMsg = `Đã đổi prefix hiện tại của bot thành:${os.EOL}${group.prefix}`;
					return api.sendMessage(replyMsg, message.threadID);
				}

				if (body.indexOf(group.prefix) == 0) {
					// check if plugin
					const temp = body.split(" ")[0].split(group.prefix);
					const pluginName = temp[temp.length - 1]; // lay ten plugin
					if (pluginName) {
						const plugin = pluginManager.findPluginByKeyword(
							pluginName
						); // find cua classs pluginManager khac voi class Manager
						if (plugin) {
							plugin.fn.call({
								group,
							}, parseArg(body, "א"), api, message);
						} else {
							api.sendMessage("Lệnh không xác định!", threadID);
						}
					}
					return;
				} else {
					// not a plugin
					group.messagesCount++;
					const member = group.memberManager.addMember(senderID, threadID);
					member.messagesCount++;
					// group.uploadToDtb();
					// group.memberManager.find(senderID, true, true).uploadToDtb();
					// if (group.gaming) {
					// 	group.game.update(
					// 		body,
					// 		api,
					// 		message,
					// 		group,
					// 		kb2abot.groupManager
					// 	);
					// } else {
					// 	if (group.chat)
					// 		// bot autoreply is on?
					// 		pluginManager
					// 			.findpluginByKeyword("autoreply")
					// 			.reply(body, api, message);
					// }
				}
			});
		}
	);
};