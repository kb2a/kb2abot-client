const decache = require('decache');
const path = require('path');
const {getParam} = kb2abot.helpers;

module.exports = {
	keywords: ['reloadgame', 'rlgame'],

	name: 'Reload game',

	description: 'Reload game',

	guide: '<game name>',

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
		const gameName = getParam(message.body);
		if (!gameName) return reply('Vui lòng nhập tên game!');
		const game = kb2abot.gameManager.findGameByName(gameName);
		if (!game) {
			reply(
				`Không tìm thấy game nào có tên: "${gameName}"\n Vui lòng xem lại danh sách game ở ${kb2abot.config.DEFAULT_THREAD_PREFIX}game!`
			);
		} else {
			try {
				const gamePath = path.join(kb2abot.config.DIR.GAME, gameName);
				decache(gamePath);
				kb2abot.gameManager.games[gameName] = require(gamePath);
				reply(`Đã reload game "${gameName}"`);
			} catch (e) {
				console.newLogger.error(e.stack);
			}
		}
	}
};
