const {getParam} = kb2abot.helpers;
const gameManager = kb2abot.gameManager;

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Chơi game",

	keywords: ["game"],

	description: "Hiện tại gồm các game: " + gameManager.getList().join(", "),

	extendedDescription: "<tên game>",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
		for (const game of gameManager.items) {
			if ((game.participants.includes(message.senderID) && !message.isGroup) || game.threadID == message.threadID) {
				game.onMessage(api, message);
			}
		}
	},

	onCall: async function(api, message) {
		// if (!message.isGroup) {
		// 	return api.replyMessage("Bạn không thể khởi tạo game trong tin nhắn riêng tư!");
		// }
		const tmp = getParam(message.body).split(" ");
		const gameName = tmp[0];
		const gameParam = tmp.slice(1).join(" ");

		if (gameManager.isValid(gameName)) {
			try {
				gameManager.run(gameName, {
					masterID: message.senderID,
					threadID: message.threadID,
					param: gameParam,
					isGroup: message.isGroup
				});
				api.replyMessage(`Đã khởi tạo game ${gameName} với param "${gameParam}" thành công!`);
			}
			catch(e) {
				api.replyMessage(`Không thể tạo game ${gameName}\nGặp lỗi: ${e.message}`);
			}
		} else {
			api.replyMessage(`Không tìm thấy game nào có tên ${gameName}!\n\nList các game:\n- ${gameManager.getList().join("\n- ")}`);
		}
	}
};
