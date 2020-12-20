const os = require("os");
const login = require("facebook-chat-api");

// import all plugin into pluginManager
const pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);
const {Account} = require("./roles");
kb2abot.account = new Account({
	id: kb2abot.id
});
console.log(`Dang tai datastore ${kb2abot.id}.json . . .`);
kb2abot.utils.DATASTORE.load();
setInterval(kb2abot.utils.DATASTORE.save, 5000);

const fn = async function(err, message) {
	const api = this.api; // binded {api: api}
	if (!message || message.threadID == undefined) return;
	if (!message.body) return;
	message.body = message.body.trim();

	const group = kb2abot.account.addGroup(message.threadID, kb2abot.id);
	const member = group.addMember(message.senderID, message.threadID);

	if (!group.storage.prefix) group.storage.prefix = "/";

	if (message.body.toLowerCase() == "prefix") {
		return api.sendMessage(
			`Prefix hiện tại của group là:${os.EOL}${group.storage.prefix}`,
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
		group.storage.prefix = tmp[1];
		const replyMsg = `Đã đổi prefix hiện tại của bot thành:${os.EOL}${group.storage.prefix}`;
		return api.sendMessage(replyMsg, message.threadID);
	}

	const executePlugin = async plugin => {
		try {
			const pluginName = plugin.keywords[0];
			if (!kb2abot.account.storage[pluginName])
				kb2abot.account.storage[pluginName] = {};
			if (!group.storage[pluginName]) group.storage[pluginName] = {};
			if (!member.storage[pluginName]) member.storage[pluginName] = {};
			await plugin.fn.call(
				{
					group,
					accountStorage: kb2abot.account.storage[pluginName],
					groupStorage: group.storage[pluginName],
					memberStorage: member.storage[pluginName]
				},
				api,
				message
			);
		} catch (e) {
			console.log(e);
			api.sendMessage("Lỗi: " + e.message, message.threadID);
		}
	};

	if (message.body.indexOf(group.storage.prefix) == 0) {
		// check if plugin
		const temp = message.body.split(" ")[0].split(group.storage.prefix);
		const keyword = temp[temp.length - 1]; // lay ten plugin
		if (keyword) {
			const plugin = pluginManager.findPluginByKeyword(keyword);
			if (plugin) {
				await executePlugin(plugin);
			} else {
				api.sendMessage("Lệnh không xác định!", message.threadID);
			}
		}
	} else {
		for (const plugin of pluginManager.getContinuousPlugin()) {
			await executePlugin(plugin);
		}
		group.messagesCount++;
		member.messagesCount++;
	}
};

module.exports = appState => {
	login({appState}, function(err, api) {
		if (err) return console.log(err);
		// kb2abot.account.downloadAllFromDtb();
		api.listenMqtt(
			fn.bind({
				api
			})
		);
	});
};
