module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Plugin that do awesome things",

	keywords: ["debug"],

	description: "This plugin is awesome!",

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
