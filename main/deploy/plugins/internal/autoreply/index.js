const botengines = loader(`${__dirname}/botengines`);
const {getParam} = kb2abot.helpers;

module.exports = {
	keywords: ['autoreply', 'auto'],

	name: 'Tự động trả lời tin nhắn',

	description: 'Dùng để bật chức năng tự động trả lời tin nhắn cho bot',

	guide:
		'<engine>\nHiện tại gồm các engine: Simsimi*, Simsumi.\nĐể tắt bot thì dùng engine: off (/auto off)',

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
				engine: 'off'
			}
		}
	},

	async onLoad() {},

	hookType: 'non-command',

	async onMessage(message, reply) {
		const {local} = this.storage.thread;
		if (local.engine != 'off')
			botengines[this.storage.thread.local.engine](message, reply);
	},

	async onCall(message, reply) {
		const {local} = this.storage.thread;
		const name = getParam(message.body) || 'Simsimi';
		if (name != 'off') {
			for (const botEngine in botengines) {
				if (name.toLowerCase() == botEngine.toLowerCase()) {
					local.engine = botEngine;
					reply(`${local.engine} xin chào bạn!`);
					return;
				}
			}
			reply(`Không tìm thấy engine nào có tên: ${name}`);
		} else {
			if (local.engine != 'off') {
				reply(`${local.engine} chào tạm biệt ~~`);
				local.engine = 'off';
			}
		}
	}
};
