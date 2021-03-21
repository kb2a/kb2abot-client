module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "(For developer)",

	keywords: ["debug"],

	description: "Gửi json storage",

	extendedDescription: "",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
	},

	onCall: async function(api, message) {
		api.replyMessage(`Storage: ${JSON.stringify(this.storage)}`, message.threadID);
	}
};
