let code = Date.now() % 10000;

module.exports = {
	keywords: ['cprefix'],

	name: 'Đổi prefix',

	description: 'Hiển thị & thay đổi prefix',

	guide:
		'\nHướng dẫn set prefix:\ncprefix <prefix mà bạn muốn đặt> [<code>]\n Cái <code> sẽ rất hữu dụng khi trong group có nhiều bot có cùng prefix!',

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
			global: {
				prefix: kb2abot.config.DEFAULT_THREAD_PREFIX
			},
			local: {}
		}
	},

	async onLoad() {},

	hookType: 'non-command',

	async onMessage(message, reply) {
		const glStge = this.storage.thread.global;
		if (message.body.toLowerCase() == 'prefix') {
			// kiem tra prefix
			code = Date.now() % 10000;
			return reply(
				`Prefix hiện tại của thread là:\n${glStge.prefix}\nHướng dẫn set prefix:\n${glStge.prefix}cprefix <prefix mà bạn muốn đặt> ${code}`
			);
		}
	},

	async onCall(message, reply) {
		const glStge = this.storage.thread.global;
		const tmp = message.body.split(' ');
		if (tmp.length <= 1) return reply('Sai cú pháp!');
		if (tmp.length >= 3 && tmp[2] != code)
			return reply(`Sai code, code prefix hiện tại là: ${code}`);
		if (tmp[1].length > 1) return reply('Prefix chỉ nên có 1 kí tự!');
		glStge.prefix = tmp[1];
		const replyMsg = `Đã đổi prefix hiện tại của bot thành:\n${glStge.prefix}`;
		return reply(replyMsg);
	}
};
