const {sendMessage, getThreadList, deleteThread} = kb2abot.helpers.fca;

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Accept pending",

	keywords: ["aar"],

	description: "Tự động chấp nhận tin nhắn đang chờ và spam",

	extendedDescription: "",

	hideFromHelp: true,

	disable: false,

	onLoad: async function(api) {
		setInterval(async () => {
			const list = [
				...await getThreadList(api, 1, null, ["PENDING"]),
				...await getThreadList(api, 1, null, ["OTHER"])
			];
			if (list[0]) {
				const {isSubscribed, threadID} = list[0];
				const err = await sendMessage(api, "KB2ABOT - CONNECTED", threadID);
				if (!isSubscribed || err)
					await deleteThread(api, threadID);
				else {
					await sendMessage(api, "/help để xem danh sách lệnh!", threadID);
					console.newLogger.success("THREAD " + threadID + " CONNECTED!");
				}
			}
		}, 10000);
	},

	onMessage: async function(api, message) {
	},

	onCall: async function(api, message) {
	}
};
