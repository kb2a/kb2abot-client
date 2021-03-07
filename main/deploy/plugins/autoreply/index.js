const botengines = loader.load(__dirname + "/botengines");
const {getParam} = kb2abot.helpers;
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
		if (getParam(message.body) != "off") {
			let name = getParam(message.body);
			if (!botengines[name])
				name = name.toLowerCase();

			if (botengines[name]) {
				this.storage.thread.local.engine = name;
				api.replyMessage(`${name} xin chào bạn!`, message.threadID);
			} else {
				api.replyMessage(
					`Không tìm thấy engine nào có tên: ${name}`,
					message.threadID
				);
			}
		} else {
			if (this.storage.thread.local.engine) {
				api.replyMessage(
					`${this.storage.thread.local.engine} chào tạm biệt ~~`,
					message.threadID
				);
				delete this.storage.thread.local.engine;
			}
		}
	}
};
