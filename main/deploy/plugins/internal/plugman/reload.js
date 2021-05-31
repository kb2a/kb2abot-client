const {getParam} = kb2abot.helpers;
const decache = require('decache');
module.exports = {
	keywords: ['reload'],

	name: 'Reload command/game',

	description: 'Reload command(lệnh) hoặc game',

	guide: '<keyword>',

	childs: [],

	permission: {
		'*': 'superAdmin'
	},

	datastoreDesign: {
		account: {
			global: {},
			local: {}
		},
		thread: {
			global: {},
			local: {}
		}
	},

	async onLoad() {},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		const keyword = getParam(message.body);
		if (!keyword) return reply('Vui lòng nhập keyword!');
		const found = kb2abot.pluginManager.findCommandsByKeyword(keyword);
		if (found.length == 0) {
			reply(
				`Không tìm thấy lệnh: "${keyword}"\n Vui lòng xem danh sách lệnh ở help!`
			);
		}
		if (found.length == 1) {
			const command = found[0].command;
			try {
				decache(command._.path);
				const newCommand = await kb2abot.pluginManager.loadCommand(
					command._.path,
					false
				);
				Object.assign(command, newCommand);
				for (const prop in command) {
					if (newCommand[prop] === undefined) delete command[prop];
				}
				reply(`Đã reload "${command.keywords[0]}"`);
			} catch (e) {
				console.newLogger.error(e.stack);
			}
		}
		if (found.length > 1) {
			let replyMsg = `Có ${found.length} lệnh: \n`;
			for (const f of found) {
				replyMsg += genHelp(prefix, f) + '\n\n';
			}
			reply(replyMsg);
		}
	}
};
