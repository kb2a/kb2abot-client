const {getParam} = kb2abot.helpers;
const {preplyMessage} = kb2abot.helpers.fca;

module.exports = {
	authorDetails: {
		name: "xxx",
		contact: "fb.com/xxx"
	},

	friendlyName: "Plugin that do awesome things",

	keywords: ["game"],

	description: "This plugin is awesome!",

	extendedDescription: "",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
		// const threadGlStge = this.storage.thread.global;
		// if (isGaming(threadGlStge.game)) {
		// 	threadGlStge.game.onMessage.call(this, api, message);
		// }
	},

	onCall: async function(api, message) {
		// const threadGlStge = this.storage.thread.global;
		// const gameName = getParam(message.body);
		// if (validGame(gameName)) {
		// 	if (!threadGlStge.game.name) {
		// 		threadGlStge.game = new Game[gameName]({ // recode game manager
		// 			masterID: message.senderID,
		// 			threadID: message.threadID,
		// 			msgParam: getParam(message.body)
		// 		});
		// 		await preplyMessage(api, [`Đã khởi tạo game ${gameName} thành công!`, message.threadID]);
		// 	}
		// } else {
		// 	await preplyMessage(
		// 		api,
		// 		[
		// 			`Không tìm thấy game nào có tên ${gameName}!\n\nList các game:\n- ${getGameList().join("\n- ")}`,
		// 			message.threadID
		// 		]
		// 	);
		// }
	}
};
