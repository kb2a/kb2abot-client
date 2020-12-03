const os = require("os");
const login = require("facebook-chat-api");

// import all plugin into pluginManager
const pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);
const {Account} = require("./roles");
const account = new Account({
	id: kb2abot.id
});

const fn = async function(err, message) {
	const api = this.api; // binded {api: api}
	if (!message || message.threadID == undefined) return;
	if (!message.body) return;
	message.body = message.body.trim();

	const group = account.addGroup(message.threadID, kb2abot.id);

	if (group.updating)
		// check if is updating . . .
		return;

	if (message.body.toLowerCase() == "prefix") {
		return api.sendMessage(
			`Prefix hiện tại của group là:${os.EOL}${group.prefix}`,
			message.threadID
		);
	}

	if (message.body.toLowerCase().indexOf("prefix ") == 0) {
		const tmp = message.body.split(" ");
		if (tmp.length > 2) {
			return api.sendMessage(
				`Sai cú pháp prefix!${os.EOL}prefix <prefix mà bạn muốn đặt>`,
				message.threadID
			);
		}
		group.prefix = tmp[1];
		const replyMsg = `Đã đổi prefix hiện tại của bot thành:${os.EOL}${group.prefix}`;
		return api.sendMessage(replyMsg, message.threadID);
	}

	if (message.body.indexOf(group.prefix) == 0) {
		// check if plugin
		const temp = message.body.split(" ")[0].split(group.prefix);
		const pluginName = temp[temp.length - 1]; // lay ten plugin
		if (pluginName) {
			const plugin = pluginManager.findPluginByKeyword(pluginName);
			if (plugin) {
				try {
					await plugin.fn.call(
						{
							group,
							account
						},
						api,
						message
					);
				} catch (e) {
					api.sendMessage(e.message, message.threadID);
				}
			} else {
				api.sendMessage("Lệnh không xác định!", message.threadID);
			}
		}
		return;
	} else {
		// not a plugin
		group.messagesCount++;
		const member = group.addMember(message.senderID, message.threadID);
		member.messagesCount++;
		// group.uploadToDtb();
		// group.memberManager.find(message.senderID, true, true).uploadToDtb();
		// if (group.gaming) {
		// 	group.game.update(
		// 		message.body,
		// 		api,
		// 		message,
		// 		group,
		// 		account
		// 	);
		// } else {
		// 	if (group.chat)
		// 		// bot autoreply is on?
		// 		pluginManager
		// 			.findpluginByKeyword("autoreply")
		// 			.reply(message.body, api, message);
		// }
	}
};

module.exports = appState => {
	login({appState}, function(err, api) {
		if (err) return console.log(err);
		// accounty.downloadAllFromDtb();
		api.listenMqtt(
			fn.bind({
				api
			})
		);
	});
};
