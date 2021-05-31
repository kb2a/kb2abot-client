const {getThreadInfo, getUserInfo} = kb2abot.helpers.fca;
const {getParam} = kb2abot.helpers;

module.exports = {
	keywords: ['rank'],

	name: 'Xếp hạng',

	description: 'Xếp hạng theo độ tương tác trong nhóm',

	guide: '<max> (default: 10)',

	childs: [],

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
			local: {
				rank: {}
			}
		}
	},

	async onLoad() {},

	hookType: 'non-command',

	async onMessage(message, reply) {
		const {rank} = this.storage.thread.local;
		rank[message.senderID] = (rank[message.senderID] || 0) + 1;
	},

	async onCall(message, reply) {
		const {rank} = this.storage.thread.local;
		const max = Number(getParam(message.body)) || 5;
		try {
			const {participantIDs} = await getThreadInfo(message.threadID);
			const temp = [];
			for (const threadID of participantIDs)
				temp.push({
					threadID,
					amount: rank[threadID] || 0
				});
			temp.sort((a, b) => b.amount - a.amount);
			const final = [];
			for (const tmp of temp) {
				participantIDs.includes(tmp.threadID) && final.push(tmp.threadID);
			}
			const uinfos = await getUserInfo(final.slice(0, max));
			let repMsg = `Top ${max} bạn tương tác nhiều nhất: \n`;
			for (let i = 0; i < temp.length; i++) {
				if (!uinfos[temp[i].threadID]) continue;
				const {name} = uinfos[temp[i].threadID];
				repMsg += `${i + 1}. (${temp[i].amount}) ${name}\n`;
			}
			reply(repMsg);
		} catch (e) {
			reply('Lỗi phát sinh trong quá trình xếp hạng:\n' + e.message);
		}
	}
};
