const os = require("os");
const BotEngines = require("./botengines");

module.exports = {
	type: "continuous",
	friendlyName: "Tự động trả lời tin nhắn",
	keywords: ["autoreply", "auto"],
	description:
		"Dùng để bật chức năng tự động trả lời cho bot, default là xài engine 'simsimi'",
	extendedDescription: `/autoreply <engineName>${os.EOL}Các engineName: simsimi, mitsuku.`,
	// preload: async api => {},
	fn: async function(api, message) {
		if (this.group.chat == false) {
			api.sendMessage(
				"Bạn chưa bật chat cho group, vui lòng sử dụng lệnh: /switch --chat on",
				message.threadID
			);
		} else {
			const fixedEngineName = kb2abot.utils.autoreply.fixEngineName(message.body);
			if (BotEngines[fixedEngineName]) {
				this.engine = fixedEngineName;
				api.sendMessage(
					`Đã chuyển xài engine: ${fixedEngineName}`,
					message.threadID
				);
			} else {
				api.sendMessage(
					`Không tìm thấy engine nào có tên: ${fixedEngineName}`,
					message.threadID
				);
			}
		}
	}
};
