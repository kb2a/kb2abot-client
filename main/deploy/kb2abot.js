const os = require("os");
const login = require("facebook-chat-api");
const storageModel = require("./storage-model");

// import all plugin into pluginManager
const pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);
const {Account} = require("./roles");
kb2abot.account = new Account({
	id: kb2abot.id
});
kb2abot.utils.DATASTORE.load();
kb2abot.account.storage = Object.assign(storageModel.account, kb2abot.account.storage);
console.newLogger.success(`Loaded datastore ${kb2abot.id}.json!`);
setInterval(kb2abot.utils.DATASTORE.save, 5000);

const fn = async function(err, message) {
	const api = this.api; // binded {api: api}
	if (!message || message.threadID == undefined) return;
	if (!message.body) return;
	message.body = message.body.trim();

	const group = kb2abot.account.addGroup(message.threadID, kb2abot.id);
	const member = group.addMember(message.senderID, message.threadID);

	group.storage = Object.assign(storageModel.group, group.storage);
	member.storage = Object.assign(storageModel.member, member.storage);

	if (Date.now() <= group.storage.blockTime)
		return;

	if (message.body.toLowerCase() == "prefix") { // kiem tra prefix
		return api.sendMessage(
			`Prefix hiện tại của group là:${os.EOL}${group.storage.prefix}`,
			message.threadID
		);
	}

	if (message.body.toLowerCase().indexOf("prefix ") == 0) { // set prefix
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

	const executePlugin = async (type = "onCall", plugin) => {
		try {
			const pluginName = plugin.keywords[0];
			if (!kb2abot.account.storage[pluginName])
				kb2abot.account.storage[pluginName] = {};
			if (!group.storage[pluginName]) group.storage[pluginName] = {};
			if (!member.storage[pluginName]) member.storage[pluginName] = {};
			await plugin[type].call( // type hiện tại gồm 2 giá trị: onCall hoặc onMessage
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
			console.newLogger.error(e.stack);
			api.sendMessage(e.stack, message.threadID);
		}
	};

	if (message.body.indexOf(group.storage.prefix) == 0) {
		// is using plugin ==>
		const keyword = message.body.split(" ")[0].split(group.storage.prefix).slice(-1)[0];
		// lay ten plugin
		if (keyword) {
			const plugin = pluginManager.findPluginByKeyword(keyword);
			if (plugin) {
				await executePlugin("onCall", plugin);
			} else {
				api.sendMessage(`Không tìm thấy lệnh nào có tên ${keyword}!`, message.threadID);
			}
		} else {
			api.sendMessage(`Whut :V?\n${group.storage.prefix}<lệnh> <nội dung truyền vào lệnh>`, message.threadID);
		}
	} else {
		// is not using plugin ==>
		group.messagesCount++;
	}

	for (const plugin of pluginManager.items) {
		await executePlugin("onMessage", plugin);
	}
	member.messagesCount++;
};

module.exports = appState => {
	login({appState}, function(err, api) {
		if (err) {
			console.newLogger.error(JSON.stringify(err));
			process.exit();
		}
		api.listenMqtt(
			fn.bind({
				api
			})
		);
	});
};
