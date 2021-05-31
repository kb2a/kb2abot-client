module.exports = {
	keywords: ['backup'],

	name: 'Lưu trữ tin nhắn',

	description: 'Xem tin nhắn đã gỡ hoặc sao lưu tin nhắn',

	guide: '',

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
			local: {
				messages: []
			}
		}
	},

	async onLoad() {},

	hookType: '*',

	async onMessage(message, reply) {
		this.storage.thread.local.messages.push(message);
	},

	async onCall(message, reply) {
		reply(
			`Tổng số tin nhắn đã lưu trữ: ${this.storage.thread.local.messages.length}`
		);
	}
};
