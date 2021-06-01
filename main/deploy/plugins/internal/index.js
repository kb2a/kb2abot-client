const {getInstructor} = kb2abot.helpers;
const childs = [
	'autoreply',
	'plugman',
	'aar',
	'backup',
	'cprefix',
	'everyone',
	'game',
	'help',
	'rank',
	'report',
	'version',
	'weather'
];

module.exports = {
	keywords: ['internal'],

	name: 'Internal commands',

	description: 'Official internal commands',

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
		reply(getInstructor('INTERNAL ⭐', childs));
	}
};
