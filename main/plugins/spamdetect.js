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

	disable: true,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
		if (message.body.indexOf(this.storage.thread.global.prefix) != 0)
			return;
		const stl = this.storage.thread.local; // stl means (s)torage.(t)hread.(l)ocal
		if (!stl.spamScore)
			stl.spamScore = 0;
		if (!stl.lastMessage)
			stl.lastMessage = 0;
		const diff = Date.now() - stl.lastMessage;
		if (diff <= 1500)
			stl.spamScore += (2000 - diff)/1000;
		else
			stl.spamScore -= (diff - 800)/1000;
		stl.spamScore = constrain(stl.spamScore, 0, 10);
		if (stl.spamScore >= 10) {
			api.sendMessage("Too frequent! Blocking group for 5 mins...", message.threadID);
			stl.blockTime = Date.now() + 1000 * 60 * 5;
			stl.spamScore = 0;
		}
		stl.lastMessage = Date.now();
	},

	onCall: async function(api, message) {
	}
};
