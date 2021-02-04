const os = require("os");
const login = require("facebook-chat-api");

// import all plugin into pluginManager
const pluginManager = new kb2abot.helpers.PluginManager(kb2abot.plugins);

const {Account} = require("./roles");
kb2abot.account = new Account({id: kb2abot.id});
try {
	kb2abot.account.load();
	console.newLogger.success(`Loaded datastore ${kb2abot.id}.json!`);
}
catch(e) {
	console.newLogger.error(`Datastore ${kb2abot.id}.json khong hop le!`);
	console.newLogger.error(`Vui long xoa hoac sua lai file ${__dirname}\\${kb2abot.id}.json!`);
	process.exit();
}
kb2abot.account.storage = new kb2abot.schemas.AccountStorage(kb2abot.account.storage);
setInterval(() => kb2abot.account.save(), 5000);

const executePlugin = async ({
	api,
	message,
	thread,
	type = "onCall", // type hiện tại gồm 2 giá trị: onCall hoặc onMessage
	plugin
} = {}) => {
	try {
		if (!plugin[type])
			return;
		const pluginName = plugin.keywords[0];
		if (!kb2abot.account.storage[pluginName])
			kb2abot.account.storage[pluginName] = {};
		if (!thread.storage[pluginName])
			thread.storage[pluginName] = {};
		const params = [
			{
				thread,
				storage: {
					account: {
						global: kb2abot.account.storage,
						local: kb2abot.account.storage[pluginName]
					},
					thread: {
						global: thread.storage,
						local: thread.storage[pluginName]
					}
				}
			},
			api,
			message
		];
		if (plugin[type].constructor.name === "AsyncFunction")
			await plugin[type].call(...params);
		else
			plugin[type].call(...params);
	} catch (e) {
		console.newLogger.error(e.stack);
		api.sendMessage(e.stack, message.threadID);
	}
};

const fn = async function(err, message) {
	const api = this.api; // binded from callback(api) of fca.login
	if (!message || !message.threadID || !message.body) return;
	message.body = message.body.trim();

	const thread = kb2abot.account.addThread(message.threadID);
	thread.storage = new kb2abot.schemas.ThreadStorage(thread.storage);
	if (Date.now() <= thread.storage.blockTime)
		return;

	if (message.body.toLowerCase() == "prefix") { // kiem tra prefix
		return api.sendMessage(
			`Prefix hiện tại của thread là:${os.EOL}${thread.storage.prefix}`,
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
		thread.storage.prefix = tmp[1];
		const replyMsg = `Đã đổi prefix hiện tại của bot thành:${os.EOL}${thread.storage.prefix}`;
		return api.sendMessage(replyMsg, message.threadID);
	}

	if (message.body.indexOf(thread.storage.prefix) == 0) { // is using plugin ==>
		const keyword = message.body.split(" ")[0].split(thread.storage.prefix).slice(-1)[0]; // lấy keyword của message
		if (keyword) {
			const plugin = pluginManager.findPluginByKeyword(keyword);
			if (plugin) {
				await executePlugin({api, message, thread, type: "onCall", plugin});
			} else {
				api.sendMessage(`Không tìm thấy lệnh nào có keyword: ${keyword}!`, message.threadID);
			}
		} else {
			api.sendMessage(`Sai cú pháp!\n${thread.storage.prefix}<lệnh> <nội dung truyền vào lệnh>`, message.threadID);
		}
	}

	for (const plugin of pluginManager.items) {
		await executePlugin({api, message, thread, type: "onMessage", plugin});
	}
};

module.exports = appState => {
	login({appState}, async (err, api) => {
		if (err) {
			console.newLogger.error(JSON.stringify(err));
			process.exit();
		}
		api.setOptions({selfListen: true});
		api.listenMqtt(fn.bind({api}));
		for (const key in kb2abot.plugins) {
			try {
				await kb2abot.plugins[key].onLoad(api);
			}
			catch(e) {
				console.newLogger.error("onLoad -> " + e.message);
			}
		}
	});
};
