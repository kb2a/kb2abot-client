const {getParam} = kb2abot.helpers;

module.exports = {
	authorDetails: {
		name: "khoakomlem",
		contact: "fb.com/khoakomlem"
	},

	friendlyName: "Hướng dẫn",

	keywords: ["help", "h"],

	description: "Hiển thị hướng dẫn, danh sách các câu lệnh",

	extendedDescription: "[<tên plugin>]",

	hideFromHelp: false,

	disable: false,

	onLoad: async function() {
	},

	onMessage: async function(api, message) {
	},

	onCall: async function(api, message) {
		const prefix = this.storage.thread.global.prefix;
		const param = getParam(message.body);
		if (param.length > 0) {
			for (const pluginName in kb2abot.plugins) {
				const plugin = kb2abot.plugins[pluginName];
				for (const keyword of plugin.keywords) {
					if (param == keyword) {
						let replyMsg = `Lệnh: ${keyword}\n`;
						replyMsg += `Tên thân thiện: ${plugin.friendlyName}\n`;
						replyMsg += `Keywords: ${
							plugin.keywords.length > 1
								? plugin.keywords.join(", ")
								: plugin.keywords[0]
						}\n`;
						replyMsg += `Mô tả: ${plugin.description}\n`;
						replyMsg += `Tác giả: ${plugin.authorDetails.name} (${plugin.authorDetails.contact})\n`;
						replyMsg += "-----\n";
						replyMsg += `Hướng dẫn sử dụng:\n${prefix}${plugin.keywords[0]} ${plugin.extendedDescription}`;
						api.replyMessage(replyMsg, message.threadID);
						return;
					}
				}
			}
			api.replyMessage(`Không tìm thấy lệnh ${param}!`, message.threadID);
		} else {
			let replyMsg = "Danh sách câu lệnh:\n";
			let index = 0;
			for (const pluginName in kb2abot.plugins) {
				const plugin = kb2abot.plugins[pluginName];
				if (plugin.hideFromHelp) continue;
				index++;
				replyMsg += `${index}. ${plugin.keywords[0]} - ${plugin.friendlyName}\n`;
			}
			replyMsg += `${prefix}help <tên câu lệnh> để xem chi tiết và hướng dẫn sử dụng lệnh!`;
			api.replyMessage(replyMsg, message.threadID);
		}
	}
};
