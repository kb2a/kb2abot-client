const {getParam, getInstructor} = kb2abot.helpers;
const childs = ['reload', 'checkupdate'];

module.exports = {
	keywords: ['plugman'],

	name: 'Công cụ plugin/game',

	description: 'Reload các plugin hoặc game',

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
