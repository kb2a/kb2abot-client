const {getParam, getInstructor} = kb2abot.helpers;
const childs = ['reload', 'reloadgame'];

module.exports = {
	keywords: ['plugman'],

	name: 'Quản lí plugin/game',

	description: 'Công cụ quản lí plugins hoặc games',

	guide: '',

	childs,

	permission: {
		'*': '*'
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
		await reply(getInstructor('INTERNAL ⭐', childs));
	}
};
