import stringSimilarity from 'string-similarity'
import {executeCommand} from "../util/plugin.util.js"

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

export default async core => {
	for (const command of kb2abot.pluginManager.getAllCommands()) {
		try {
			await command.onLoad();
		} catch (e) {
			console.newLogger.error('onLoad -> ' + e.stack);
		}
	}
	core.listenMqtt(fn);
	console.newLogger.success(`${kb2abot.name} (${kb2abot.id}) UP !`);
}
