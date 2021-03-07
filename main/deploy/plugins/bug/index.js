module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Báo lỗi",

	keywords: ["report", "bug"],

	description: "Dùng gửi góp ý, báo lỗi tới Khoa Ko Mlem",

	extendedDescription: "<text>",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
	},

	onCall: async function(api, message) {
		const text = kb2abot.helpers.getParam(message.body);
		if (text != 0) {
			api.sendMessage(
				`Tôi có góp ý: ${text}\nTin nhắn này được gửi bởi id: ${message.threadID}`,
				"100007723935647"
			);
			api.replyMessage(
				`Đã gửi tin nhắn báo cáo với nội dung: ${text}\nCảm ơn bạn đã góp ý!!!`,
				message.threadID
			);
		} else {
			api.replyMessage(
				"Bạn thiếu param <text> (vd: /bug kb2abot đã bị lỗi!)",
				message.threadID
			);
		}
		return true;
	}
};
