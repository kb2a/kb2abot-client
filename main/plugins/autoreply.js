const {botengines, fixEngineName} = kb2abot.utils.autoreply;
const {getParam, constrain} = kb2abot.utils;
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
		if (!this.groupStorage.engine) return;
		if (!this.groupStorage.spamScore)
			this.groupStorage.spamScore = 0;
		if (!this.groupStorage.lastMessage)
			this.groupStorage.lastMessage = 0;
		const diff = Date.now() - this.groupStorage.lastMessage;
		if (diff <= 1500)
			this.groupStorage.spamScore += (2000 - diff)/1000;
		else
			this.groupStorage.spamScore -= (diff - 800)/1000;
		this.groupStorage.spamScore = constrain(this.groupStorage.spamScore, 0, 10);
		if (this.groupStorage.spamScore >= 10) {
			api.sendMessage("Too frequent! Blocking group for 5 mins...", message.threadID);
			this.group.storage.blockTime = Date.now() + 1000 * 60 * 5;
			this.groupStorage.spamScore = 0;
		}
		this.groupStorage.lastMessage = Date.now();
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
