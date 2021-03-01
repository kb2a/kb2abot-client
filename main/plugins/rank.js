const { round } = kb2abot.utils;

const copper = {
	"I": "đồng I",
	"II": "đồng II",
	"III": "đồng III"
};

const silver = {
	"I": "bạc I",
	"II": "bạc II",
	"III": "bạc III",
	"IV": "bạc IV"
};

const gold = {
	"I": "vàng I",
	"II": "vàng II",
	"III": "vàng III",
	"IV": "vàng IV"
};

const platinum = {
	"I": "bạch kim I",
	"II": "bạch kim II",
	"III": "bạch kim III",
	"IV": "bạch kim IV",
	"V": "bạch kim V"
};

const Diamond = {
	"I": "kim cương I",
	"II": "kim cương II",
	"III": "kim cương III",
	"IV": "kim cương IV",
	"V": "kim cương V",
	"VI": "kim cương VI (hạng tối đa)"
};

function rankUp (xp, threadID, senderID, userStorage) {;
	const lmao = threadID + "uid_" + senderID;
	
	if (xp >= 10 && xp < 30) {
		userStorage[lmao] = copper.I
	}else if (xp >= 30 && xp < 50) {
		userStorage[lmao] = copper.II
	}else if (xp >= 50 && xp < 70) {
		userStorage[lmao] = copper.III
	}else if (xp >= 70 && xp < 90) {
		userStorage[lmao] = silver.I
	}else if (xp >= 90 && xp < 110) {
		userStorage[lmao] = silver.II
	}else if (xp >= 110 && xp < 130) {
		userStorage[lmao] = silver.III
	}else if (xp >= 130 && xp < 150) {
		userStorage[lmao] = silver.IV
	}else if (xp >= 150 && xp < 170) {
		userStorage[lmao] = gold.I
	}else if (xp >= 170 && xp < 190) {
		userStorage[lmao] = gold.II
	}else if (xp >= 190 && xp < 210) {
		userStorage[lmao] = gold.III
	}else if (xp >= 210 && xp < 230) {
		userStorage[lmao] = gold.IV
	}else if (xp >= 230 && xp < 250) {
		userStorage[lmao] = platinum.I
	}else if (xp >= 250 && xp < 270) {
		userStorage[lmao] = platinum.II
	}else if (xp >= 270 && xp < 290) {
		userStorage[lmao] = platinum.III
	}else if (xp >= 290 && xp < 310) {
		userStorage[lmao] = platinum.IV
	}else if (xp >= 310 && xp < 330) {
		userStorage[lmao] = platinum.V
	}else if (xp >= 330 && xp < 350) {
		userStorage[lmao] = Diamond.I
	}else if (xp >= 350 && xp < 370) {
		userStorage[lmao] = Diamond.II
	}else if (xp >= 370 && xp < 390) {
		userStorage[lmao] = Diamond.III
	}else if (xp >= 390 && xp < 410) {
		userStorage[lmao] = Diamond.IV
	}else if (xp >= 410 && xp < 430) {
		userStorage[lmao] = Diamond.V
	}else if (xp >= 430) {
		userStorage[lmao] = Diamond.VI
	}else {
		userStorage[lmao] = "chưa có"
	}
};
	
module.exports = {
	authorDetails: {
		name: "KhoaKoMlem, Citnut",
		// Tên tác giả của plugin này
		contact: "https://fb.com/nguyen.thanh.chinhs"
		// Liên hệ (có thể là link fb, gmail, ...)
	},

	friendlyName: "beta",
	// Tên thân thiện của plugin (hiển thị trong danh sách câu lệnh)

	keywords: ["rank"],
	// Các từ khóa để gọi plugin rank (có thể có nhiều keyword)
	// ví dụ keyword "test" thì khi có người nhắn <prefix>test là plugin được gọi

	description: "plugin rank(v0.4 beta)",
	// Nội dung của plugin (hiển thị trong hướng dẫn chi tiết)

	extendedDescription: "",
	// Hướng dẫn sử dụng của plugin (hiển thị trong hướng dẫn chi tiết)
	// Phần này được nối đuôi sau từ "<prefix>rank " nên chú ý nhé

	hideFromHelp: false,
	// Ẩn plugin khỏi help
	// true là ẩn, còn false là hiện

	disable: false,
	// Bật/Tắt plugin
	// Nếu tắt thì plugin sẽ không được load và xài được (nhưng vẫn check syntax)
	// true là tắt, false là bật

	onLoad: async function() {
		console.log("plugin rank v0.4 (beta)")
		// Được gọi ngay sau khi load xong plugin
		// Chủ yếu dùng để log thôi không quan trọng
		// (Hoặc cũng có thể chuẩn bị các async function bằng await)
	},

	onMessage: async function(api, message) {
		if (!this.storage.account.global.messageCount) {
			this.storage.account.global.messageCount = {}
		};
		if (!this.storage.account.global.rank) {
			this.storage.account.global.rank = {}
		};
		
		if (this.storage.account.global.messageCount[message.threadID + "uid_" + message.senderID] == null) {
			this.storage.account.global.messageCount[message.threadID + "uid_" + message.senderID] = 0
		}else {
			this.storage.account.global.messageCount[message.threadID + "uid_" + message.senderID]++
		};
		if (this.storage.account.global.rank[message.threadID + "uid_" + message.senderID] == null) {
			this.storage.account.global.rank[message.threadID + "uid_" + message.senderID] = "chưa có"
		}else {
			rankUp(this.storage.account.global.messageCount[message.threadID + "uid_" + message.senderID], message.threadID, message.senderID, this.storage.account.global.rank);
		}
		// Được gọi mỗi khi có message nhắn tới (kể cả khi dùng lệnh)
		// Chủ yếu dùng để làm mấy plugin kiểu gián điệp hoặc game
		// Xử lí mọi tin nhắn mà không cần prefix
	},

	onCall: async function(api, message) {		
		function reply(msg) {
			api.sendMessage(msg, message.threadID, message.messageID)
		};
		
		const EXP = this.storage.account.global.messageCount[message.threadID + "uid_" + message.senderID];
		const getRank = this.storage.account.global.rank[message.threadID + "uid_" + message.senderID];
		
		api.getUserInfo(message.senderID, (err, ret) => {
			for (let prop in ret) {
				if (ret.hasOwnProperty(prop) && ret[prop].name) {
					reply(`${ret[prop].name}(uid: ${message.senderID})\r\n---\r\nlevel: ${round(EXP/20, 0)}\r\nxp: ${EXP}\r\n---\r\nrank: ${getRank}`)
				}
			}
		})
		// Được gọi khi có member xài lệnh của mình
		// Là cốt lõi của plugin không có phần này thì có nghĩa sẽ không có chuyện
		// gì xảy ra khi gọi plugin (để hideFromHelp true nữa là plugin như batman)
	}
};
