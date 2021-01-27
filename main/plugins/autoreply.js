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
		if (!this.storage.thread.local.engine || message.body[0] == this.storage.thread.global.prefix) return;
		botengines[this.storage.thread.local.engine](api, message);
	},

	onCall: async function(api, message) {
		if (getParam(message.body) == "off" && this.storage.thread.local.engine) {
			api.sendMessage(
				`${this.storage.thread.local.engine} chào tạm biệt ~~`,
				message.threadID
			);
			delete this.storage.thread.local.engine;
			return;
		}

		const fixedEngineName = fixEngineName(message.body.split(" ")[1]);
		if (botengines[fixedEngineName]) {
			this.storage.thread.local.engine = fixedEngineName;
			api.sendMessage(`${fixedEngineName} xin chào bạn!`, message.threadID);
		} else {
			api.sendMessage(
				`Không tìm thấy engine nào có tên: ${fixedEngineName}`,
				message.threadID
			);
		}
	}
};
