const { constrain } = kb2abot.utils;

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Kiểm tra spam",

	keywords: ["spamdetect"],

	description: "Block những group đang spam tin nhắn tới bot",

	extendedDescription: "",

	hideFromHelp: true,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
		if (message.body.indexOf(this.group.storage.prefix) != 0)
			return;
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
	},

	onCall: async function(api, message) {
	}
};
