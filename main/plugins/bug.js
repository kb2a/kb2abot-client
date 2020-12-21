const os = require("os");

module.exports = {
	type: "normal",
	friendlyName: "Báo lỗi",
	keywords: ["report", "bug"],
	description: "Dùng gửi góp ý, báo lỗi tới Khoa Ko Mlem",
	extendedDescription: "<text>",
	fn: async function(api, message) {
		// this.group ở đây
		const text = kb2abot.utils.getParam(message.body);
		if (text != 0) {
			const member = this.group.add(
				{
					id: message.senderID
				},
				{
					id: message.senderID
				}
			); // lam2 function download form facebook nua
			api.sendMessage(
				`Tôi có góp ý: ${text}${os.EOL}Tin nhắn này được gửi bởi id: ${member.id}`,
				"100007723935647"
			);
			api.sendMessage(
				`Đã gửi tin nhắn báo cáo với nội dung: ${text}${os.EOL}Cảm ơn bạn đã góp ý!!!`,
				message.threadID
			);
		} else {
			api.sendMessage(
				"Bạn thiếu param <text> (vd: /bug kb2abot thật tuyệt vời!)",
				message.threadID
			);
		}
		return true;
	}
};
