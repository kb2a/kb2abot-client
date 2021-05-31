const {getParam} = kb2abot.helpers;
const {getThreadInfo} = kb2abot.helpers.fca;

module.exports = {
	keywords: ['everyone', 'all'],

	name: 'Tag mọi người',

	description: 'Dùng để gọi hồn tất cả mọi người trong group',

	guide: '<text>',

	childs: [],

	permission: {
		'*': 'admin'
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
		const text = getParam(message.body);
		const {participantIDs} = await getThreadInfo(message.threadID);
		let replyMsg = '';
		const mentions = [];
		participantIDs.splice(participantIDs.indexOf(fca.getCurrentUserID()), 1);
		for (const id of participantIDs) {
			let tag = '@';
			replyMsg += tag;
			mentions.push({
				tag,
				id: id,
				fromIndex: replyMsg.length - tag.length
			});
		}
		reply({
			body: replyMsg + (text || ''),
			mentions
		});
	}
};
