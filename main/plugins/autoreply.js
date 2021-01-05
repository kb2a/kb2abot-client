const {botengines, fixEngineName} = kb2abot.utils.autoreply;
const {getParam} = kb2abot.utils;
const keywords = ["autoreply", "auto"];

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Tự động trả lời tin nhắn",

	keywords,

	description: "Dùng để bật chức năng tự động trả lời tin nhắn cho bot",

	extendedDescription: "<engine>\nHiện tại gồm các engine: Simsimi, Mitsuku.\nĐể tắt bot thì dùng engine: off",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
		this.groupStorage.engine &&
			botengines[this.groupStorage.engine](api, message);
	},

	onCall: async function(api, message) {
		if (getParam(message.body) == "off" && this.groupStorage.engine) {
			api.sendMessage(
				`${this.groupStorage.engine} chào tạm biệt ~~`,
				message.threadID
			);
			delete this.groupStorage.engine;
			return;
		}

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
	}
};
