const {sendMessage, getThreadList, deleteThread} = kb2abot.helpers.fca;
let enable = true;

module.exports = {
	keywords: ['aar'],

	name: 'Accept pending',

	description: 'Tự động chấp nhận tin nhắn đang chờ và spam',

	guide: '',

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

	async onLoad() {
		setInterval(async () => {
			if (!enable) return;
			const list = [
				...(await getThreadList(1, null, ['PENDING'])),
				...(await getThreadList(1, null, ['OTHER']))
			];
			if (list[0]) {
				const {isSubscribed, threadID} = list[0];
				const err = await sendMessage('KB2ABOT - CONNECTED', threadID);
				if (!isSubscribed || err) await deleteThread(threadID);
				else {
					await sendMessage(
						`${kb2abot.config.DEFAULT_THREAD_PREFIX}help để xem danh sách lệnh!`,
						threadID
					);
					console.newLogger.success('THREAD ' + threadID + ' CONNECTED!');
				}
			}
		}, kb2abot.config.INTERVAL.AUTO_ACCEPT_REQUEST);
	},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		enable = !enable;
		reply(`Đã ${enable ? 'BẬT' : 'TẮT'} tự động chấp nhận tin nhắn đang chờ`);
	}
};
