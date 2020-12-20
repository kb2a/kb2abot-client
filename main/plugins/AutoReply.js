const os = require("os");
const {botengines, fixEngineName} = kb2abot.utils.autoreply;
const {getKeyword, getParam} = kb2abot.utils;
const keywords = ["autoreply", "auto"];

module.exports = {
	type: "continuous",
	friendlyName: "Tự động trả lời tin nhắn",
	keywords,
	description: "Dùng để bật chức năng tự động trả lời tin nhắn cho bot",
	extendedDescription: `/autoreply <engineName>${os.EOL}Hiện tại gồm các engine: Simsimi, Mitsuku.${os.EOL}Để tắt bot thì dùng lệnh: /autoreply off`,
	fn: async function(api, message) {
		if (getParam(message.body) == "off") {
			api.sendMessage(
				`${this.groupStorage.engine} chào tạm biệt ~~`,
				message.threadID
			);
			delete this.groupStorage.engine;
			return;
		}

		if (keywords.includes(getKeyword(message.body))) {
			const fixedEngineName = fixEngineName(message.body.split(" ")[1]);
			if (botengines[fixedEngineName]) {
				this.groupStorage.engine = fixedEngineName;
				api.sendMessage(`${fixedEngineName} xin chào bạn!`, message.threadID);
			} else {
				api.sendMessage(
					`Không tìm thấy engine nào có tên: ${fixedEngineName}`,
					message.threadID
				);
			}
		} else {
			this.groupStorage.engine &&
				botengines[this.groupStorage.engine](api, message);
		}
	}
};
