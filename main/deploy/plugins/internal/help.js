const {getParam} = kb2abot.helpers;
const genHelp = (prefix, found) => {
	const command = found.command;
	let replyMsg = `Lệnh: ${command.keywords[0]}\n`;
	replyMsg += `Tên: ${command.name}\n`;
	replyMsg += `Tên lớp: ${found.className}\n`;
	replyMsg += `Các từ khóa: ${command.keywords.join(', ')}\n`;
	replyMsg += `Mô tả: ${command.description}\n`;
	replyMsg += '-----\n';
	replyMsg += `Hướng dẫn sử dụng:\n${prefix}${command.keywords[0]} ${command.guide}`;
	return replyMsg;
};

module.exports = {
	keywords: ['help'],

	name: 'Hướng dẫn',

	description: 'Hiển thị hướng dẫn, danh sách các câu lệnh',

	guide: '[<tên command>]',

	childs: [],

	permission: {
		'*': '*'
	},

	datastoreDesign: {
		account: {
			global: {},
			local: {}
		},
		thread: {
			global: {},
			local: {}
		}
	},

	async onLoad() {},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		const prefix = this.storage.thread.global.prefix;
		const keyword = getParam(message.body);
		if (keyword) {
			const found = kb2abot.pluginManager.findCommandsByKeyword(keyword);
			if (found.length == 0) {
				reply(
					`Không tìm thấy lệnh: "${keyword}"\n Vui lòng xem danh sách lệnh ở ${prefix}help!`
				);
			}
			if (found.length == 1) {
				reply(genHelp(prefix, found[0]));
			}
			if (found.length > 1) {
				let replyMsg = `Có ${found.length} lệnh: \n`;
				for (const f of found) {
					replyMsg += genHelp(prefix, f) + '\n\n';
				}
				reply(replyMsg);
			}
		} else {
			let replyMsg = `Hiện tại có tổng ${
				kb2abot.pluginManager.getAllCommands().length
			} câu lệnh!\n\n`;
			for (let index = 0; index < kb2abot.pluginManager.items.length; index++) {
				const command = kb2abot.pluginManager.items[index];
				const childKeywords = [];
				for (const child of command._.childs) {
					childKeywords.push(child.keywords[0]);
				}
				if (command.keywords[0] == 'internal')
					replyMsg = `🔳 𝐈𝐍𝐓𝐄𝐑𝐍𝐀𝐋: ${childKeywords.join(', ')}\n` + replyMsg;
				else
					replyMsg += `▫️ ${command.keywords[0]}(${
						command.name
					}): ${childKeywords.join(', ')}\n`;
			}
			replyMsg += `\nNhớ ${prefix}help <tên câu lệnh> để xem chi tiết và hướng dẫn sử dụng lệnh nhé!\n`;
			replyMsg +=
				'Lưu ý: Trong vài help có bộ kí tự <,>,[,] ta không cần ghi vào và "[]" nghĩa là không bắt buộc.';
			reply(replyMsg);
		}
	}
};
