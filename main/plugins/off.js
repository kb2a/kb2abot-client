const os = require("os");

module.exports = {
	type: "normal",
	// gồm 2 type: "normal" và "continuous"
	// normal là gọi lệnh và thực hiện lệnh đó 1 cách bình thường
	// continuous là gọi lệnh đó xong, lệnh vẫn tiếp tục thực hiện mà không cần prefix!

	friendlyName: "Tắt plugin continuous",
	// tên thân thiện của plugin (để hiển thị trong danh sách câu lệnh)

	keywords: ["off", "offall"],
	// Là các từ khóa để gọi plugin off (có thể có nhiều cái)

	description: "Tắt 1 plugin hoặc tất cả các plugin loại continuous",
	// Là nội dung của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	extendedDescription: `/off <tên plugin>${os.EOL}/offall`,
	// Là hướng dẫn sử dụng của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	fn: async function(api, message) {
		if (message.body.split(this.group.prefix)[1] == "offall") {
			this.group.continuousPluginManager.clear();
			api.sendMessage("Đã xóa tất cả các plugin continuous!", message.threadID);
			return;
		}
		const keyword = message.body.split(" ")[1].trim();
		const index = this.group.continuousPluginManager.items.findIndex(a => {
			if (a.keywords.indexOf(keyword) == -1) return false;
			return true;
		});
		if (index != -1) {
			this.group.continuousPluginManager.items.splice(index, 1);
			api.sendMessage(
				`Đã xóa plugin continuous có keyword: ${keyword}!`,
				message.threadID
			);
		} else {
			api.sendMessage(
				`Không tìm thấy plugin continuous nào có keyword: ${keyword} cả!`,
				message.threadID
			);
		}
	}
	// function chính của plugin
};
