module.exports = {
	keywords: ['report'],

	name: 'Báo lỗi',

	description: 'Dùng gửi góp ý, báo lỗi tới nhà phát triển kb2abot',

	guide: '<text>',

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
			local: {}
		}
	},

	async onLoad() {},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		const text = kb2abot.helpers.getParam(message.body);
		if (text != 0) {
			fca.sendMessage(
				`Tôi có góp ý: ${text}\nTin nhắn này được gửi bởi id: ${message.threadID}`,
				'100007723935647'
			);
			reply(`Đã gửi tin nhắn góp ý tới nhà phát triển với nội dung: ${text}`);
		} else {
			reply('Bạn thiếu param <text> (vd: /bug kb2abot đã bị lỗi!)');
		}
	}
};
