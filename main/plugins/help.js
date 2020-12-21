const os = require("os");
const {getParam} = kb2abot.utils;

module.exports = {
	type: "normal",
	// gồm 2 type: "normal" và "continuous"
	// normal là gọi lệnh và thực hiện lệnh đó 1 cách bình thường
	// continuous là gọi lệnh đó xong, lệnh vẫn tiếp tục thực hiện mà không cần prefix!

	friendlyName: "Hướng dẫn",
	// tên thân thiện của plugin (để hiển thị trong danh sách câu lệnh)

	keywords: ["help", "h"],
	// Là các từ khóa để gọi plugin help (có thể có nhiều cái)

	description: "Hiển thị hướng dẫn",
	// Là nội dung của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	extendedDescription: "<tên plugin>",
	// Là hướng dẫn sử dụng của plugin (dùng để hiển thị trong hướng dẫn chi tiết)

	fn: async function(api, message) {
		const prefix = this.group.storage.prefix;
		const param = getParam(message.body);
		if (param.length > 0) {
			for (const pluginName in kb2abot.plugins) {
				const plugin = kb2abot.plugins[pluginName];
				for (const keyword of plugin.keywords) {
					if (param == keyword) {
						let replyMsg = `Lệnh: ${keyword}${os.EOL}`;
						replyMsg += `Tên thân thiện: ${plugin.friendlyName}${os.EOL}`;
						replyMsg += `Loại: ${plugin.type}${os.EOL}`;
						replyMsg += `Keywords: ${
							plugin.keywords.length > 1
								? plugin.keywords.join(", ")
								: plugin.keywords[0]
						}${os.EOL}`;
						replyMsg += `Mô tả: ${plugin.description}${os.EOL}`;
						replyMsg += `-----${os.EOL}`;
						replyMsg += `Hướng dẫn sử dụng:${os.EOL}${prefix}${plugin.keywords[0]} ${plugin.extendedDescription}`;
						api.sendMessage(replyMsg, message.threadID);
						return;
					}
				}
			}
			api.sendMessage(`Không tìm thấy lệnh ${param}!`, message.threadID);
		} else {
			let replyMsg = `Danh sách câu lệnh: ${os.EOL}`;
			let index = 0;
			for (const pluginName in kb2abot.plugins) {
				const plugin = kb2abot.plugins[pluginName];
				index++;
				replyMsg += `${index}. ${plugin.keywords[0]} - ${plugin.friendlyName}${os.EOL}`;
			}
			replyMsg += `${prefix}help <tên câu lệnh> để xem chi tiết và hướng dẫn sử dụng lệnh!`;
			api.sendMessage(replyMsg, message.threadID);
		}
	}
	// function chính của plugin
};
