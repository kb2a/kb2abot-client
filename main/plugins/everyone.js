const {getParam} = kb2abot.utils;

module.exports = {
	type: "normal",
	// gồm 2 type: "normal" và "continuous"
	// normal là gọi lệnh và thực hiện lệnh đó 1 cách bình thường
	// continuous là gọi lệnh đó xong, lệnh vẫn tiếp tục thực hiện mà không cần prefix!

	friendlyName: "Tag mọi người",
	// tên thân thiện của plugin (để hiển thị trong danh sách câu lệnh)

	keywords: ["everyone", "all"],
	// Là các từ khóa để gọi plugin everyone (có thể có nhiều cái)

	description: "Dùng để gọi hồn tất cả mọi người trong group",
	// Là nội dung của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	extendedDescription: "<text>",
	// Là hướng dẫn sử dụng của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	fn: async function(api, message) {
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
	// function chính của plugin
};
