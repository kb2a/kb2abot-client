const stringSimilarity = require('string-similarity');

try {
	kb2abot.account.load();
	console.newLogger.success(`Loaded datastore ${kb2abot.id}.json!`);
} catch (e) {
	console.newLogger.error(e.message);
	console.newLogger.error(
		`Vui long xoa hoac sua lai file ${__dirname}\\${kb2abot.id}.json!`
	);
	process.exit();
}
setInterval(
	() => kb2abot.account.save(),
	kb2abot.config.INTERVAL.SAVE_DATASTORE
);

const executeCommand = async ({
	reply,
	message,
	thread,
	type = 'onCall',
	command
} = {}) => {
	const permission =
		command.permission[message.threadID] || command.permission['*'] || [];
	if (type == 'onCall' && permission != '*') {
		if (
			permission == 'superAdmin' &&
			!kb2abot.config.SUPER_ADMINS.includes(message.senderID)
		)
			return reply('Bạn không thể sử dụng lệnh này!');
		if (!kb2abot.config.SUPER_ADMINS.includes(message.senderID))
			if (permission == 'admin') {
				try {
					const info =
						thread.adminIDs ||
						(await kb2abot.helpers.fca.getThreadInfo(thread.id));
					if (kb2abot.config.REFRESH_ADMINIDS) thread.adminIDs = info.adminIDs;
					if (
						info.adminIDs.findIndex(e => e.id == message.senderID) == -1 &&
						info.isGroup
					)
						return reply('Chỉ admin mới có thể xài lệnh này!');
				} catch (e) {
					reply(
						'Gặp lỗi khi đang lấy danh sách admin, vui lòng thử lại trong giây lát . . .'
					);
					console.newLogger.warn(
						`Error while getting thread ${thread.id} info:`,
						e
					);
					return;
				}
			} else if (Array.isArray(permission)) {
				if (!permission.includes(message.senderID))
					return reply('Bạn không có quyền sử dụng lệnh này!');
			} else {
				console.newLogger.warn(
					`Command phân quyền sai cú pháp: "${command.name}"`
				);
				return reply('Lệnh này chưa phân quyền!');
			}
	}
	const commandName = command.keywords[0];
	if (!kb2abot.account.storage[commandName])
		kb2abot.account.storage[commandName] = {};
	if (!thread.storage[commandName]) thread.storage[commandName] = {};
	const params = [
		{
			storage: {
				account: {
					global: kb2abot.account.storage,
					local: kb2abot.account.storage[commandName]
				},
				thread: {
					global: thread.storage,
					local: thread.storage[commandName]
				}
			}
		},
		message,
		reply
	];
	try {
		if (command[type].constructor.name === 'AsyncFunction')
			await command[type].call(...params);
		else command[type].call(...params);
	} catch (e) {
		console.newLogger.error(e.stack);
		reply(e.stack);
	}
};

const fn = async function(err, message) {
	if (!message || !message.threadID || !message.body) return;
	message.body = message.body.trim();

	const reply = (...args) =>
		kb2abot.helpers.fca.sendMessage(
			args[0],
			args[1] || message.threadID,
			args[2] || message.messageID
		);

	const thread = kb2abot.account.addThread(message.threadID);

	for (const command of kb2abot.pluginManager.getAllCommands()) {
		const commandName = command.keywords[0];
		if (!command._.extendedDatastoreDesigns.includes(thread.id)) {
			kb2abot.account.storage = {
				...command.datastoreDesign.account.global,
				...kb2abot.account.storage
			}; // account.global
			kb2abot.account.storage[commandName] = {
				...command.datastoreDesign.account.local,
				...kb2abot.account.storage[commandName]
			}; // account.local
			thread.storage = {
				...command.datastoreDesign.thread.global,
				...thread.storage
			}; // thread.global
			thread.storage[commandName] = {
				...command.datastoreDesign.thread.local,
				...thread.storage[commandName]
			}; // thread.local
			command._.extendedDatastoreDesigns.push(thread.id);
		}
	}

	if (Date.now() <= thread.storage.blockTime) return;

	if (message.body.indexOf(thread.storage.prefix) == 0) {
		// is using command ==>
		const keyword = message.body.split(' ')[0].slice(1); // lấy keyword của message
		if (keyword) {
			if (keyword.includes('.')) {
				const command = kb2abot.pluginManager.findCommandsByClasses(keyword);
				if (command)
					await executeCommand({
						reply,
						message,
						thread,
						type: 'onCall',
						command
					});
				else
					reply(
						`Không tìm thấy lệnh: "${keyword}"\n Vui lòng xem lại tên lệnh!`
					);
			} else {
				const found = kb2abot.pluginManager.findCommandsByKeyword(keyword);
				if (found.length == 0) {
					const allKeywords = [];
					for (const cmd of kb2abot.pluginManager.getAllCommands()) {
						allKeywords.push(...cmd.keywords);
					}
					const {ratings} = stringSimilarity.findBestMatch(
						keyword,
						allKeywords
					);
					ratings.sort((a, b) => b.rating - a.rating);
					const bestMatches = [
						ratings[0].target,
						ratings[1].target,
						ratings[2].target
					];
					reply(
						`Không tìm thấy lệnh: "${keyword}"\nCác lệnh gần giống: ${bestMatches.join(
							', '
						)}\nBạn có thể xem danh sách lệnh ở ${thread.storage.prefix}help!`
					);
				}

				if (found.length == 1)
					await executeCommand({
						reply,
						message,
						thread,
						type: 'onCall',
						command: found[0].command
					});
				if (found.length > 1) {
					const names = [];
					for (const f of found)
						if (!f.className.includes('.'))
							names.push('kb2abot.' + f.className);
						else names.push(f.className);
					reply(
						`Có ${found.length} lệnh: ${names.join(
							', '
						)}\nBạn muốn xài lệnh nào?`
					);
				}
			}
		} else {
			reply(
				`Sai cú pháp!\n${thread.storage.prefix}<lệnh> <nội dung truyền vào lệnh>`
			);
		}
	}

	const isCommand = message.body.indexOf(thread.storage.prefix) == 0;
	for (const command of kb2abot.pluginManager.getAllCommands()) {
		if (
			command.hookType == '*' ||
			(command.hookType == 'command-only' && isCommand) ||
			(command.hookType == 'non-command' && !isCommand)
		)
			await executeCommand({
				reply,
				message,
				thread,
				type: 'onMessage',
				command
			});
	}
};

module.exports = async fca => {
	globalThis.fca = fca; // fca will become global
	for (const command of kb2abot.pluginManager.getAllCommands()) {
		try {
			await command.onLoad();
		} catch (e) {
			console.newLogger.error('onLoad -> ' + e.stack);
		}
	}
	fca.listenMqtt(fn);
	console.newLogger.success(`${kb2abot.name} (${kb2abot.id}) UP !`);
};
