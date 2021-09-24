export const executeCommand = async ({
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