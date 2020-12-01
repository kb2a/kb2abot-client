const os = require("os");
const { parseValue } = kb2abot.utils.plugin;

module.exports = {
	friendlyName: "Báo lỗi",
	keywords: ["report", "bug"],
	description: "Dùng gửi góp ý, báo lỗi tới Khoa Ko Mlem",
	extendedDescription: "/bug <text>",
	test: {
		input: {
			body: "/bug kb2abot thật tuyệt vời!",
		},
		output: true,
	},
	fn: async function (args, api, message) {
		// this.group ở đây
		// groupManager ở global (kb2abot.groupManager)
		const text = message.body.split(" ").slice(0, 1).join(" ");
		if (text != 0) {
			console.log(this.group)
			const member = this.group.memberManager.find({
				id: message.senderID
			});// lam2 function download form facebook nua
			api.sendMessage(
				`Tôi có góp ý: ${text}${os.EOL}Tin nhắn này được gửi bởi ${member.name}, id: ${member.id}`,
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
	}
};
