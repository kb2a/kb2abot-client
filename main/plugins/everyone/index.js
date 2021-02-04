const {getParam} = kb2abot.helpers;

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Tag mọi người",

	keywords: ["everyone", "all"],

	description: "Dùng để gọi hồn tất cả mọi người trong group",

	extendedDescription: "[<text>]",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
	},

	onCall: async function(api, message) {
		const text = getParam(message.body);
		api.getThreadInfo(message.threadID, (err, arr) => {
			if (err) console.log(err);
			const {participantIDs} = arr;
			let replyMsg = "";
			const mentions = [];
			participantIDs.splice(participantIDs.indexOf(api.getCurrentUserID()), 1);
			for (const id of participantIDs) {
				let tag = "@";
				replyMsg += tag;
				mentions.push({
					tag,
					id: id,
					fromIndex: replyMsg.length - tag.length
				});
			}
			api.sendMessage(
				{
					body: replyMsg + (text || ""),
					mentions
				},
				message.threadID
			);
		});
	}
};
