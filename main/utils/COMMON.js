const fs = require("fs");
const minimist = require("minimist");

class Log {
	constructor({text, icon, bg = "bg1"} = {}) {
		this.text = text;
		this.icon = icon;
		this.bg = bg;
		this.dateCreated = Date.now();
	}

	toLocaleString() {
		return new Date(this.dateCreated).toLocaleString("en-GB");
	}
}

const log = function(logConfig, account) {
	if (!account.groupManager.listen) return;
	let logs = account.chatbot.logs;
	logs.push(new Log(logConfig));
	// account.decrypt();
	// io.to(account.username).emit("new log", logs[logs.length - 1]);
	console.log(`[${account.botName}] - ${logs[logs.length - 1].text}`);
};

const lower = text => {
	return text.toLowCase();
};

const upper = text => {
	return text.toUpperCase();
};

const round = (number, amount) => {
	return parseFloat(Number(number).toFixed(amount));
};

const extend = (obj, deep) => {
	let argsStart, deepClone;

	if (typeof deep === "boolean") {
		argsStart = 2;
		deepClone = deep;
	} else {
		argsStart = 1;
		deepClone = true;
	}

	for (let i = argsStart; i < arguments.length; i++) {
		let source = arguments[i];

		if (source) {
			for (let prop in source) {
				if (deepClone && source[prop] && source[prop].constructor === Object) {
					if (!obj[prop] || obj[prop].constructor === Object) {
						obj[prop] = obj[prop] || {};
						extend(obj[prop], deepClone, source[prop]);
					} else {
						obj[prop] = source[prop];
					}
				} else {
					obj[prop] = source[prop];
				}
			}
		}
	}

	return obj;
};

const parseArg = (str, specialChar) => {
	const quotes = ['"', "'", "`"];
	for (let quote of quotes) {
		let tmp = str.split(quote);
		for (let i = 1; i < tmp.length; i += 2) {
			str = str.replace(
				`${quote}${tmp[i]}`,
				`${tmp[i].replace(/ /g, specialChar)}`
			);
			str = str.replace(quote, "");
		}
	}
	const output = [];
	str.split(" ").forEach(word => {
		output.push(word.replace(new RegExp(specialChar, "g"), " "));
	});
	return minimist(output);
};

const parseBool = str => {
	if (["on", "true", "yes", "positive", "t"].indexOf(str) != -1) {
		return true;
	}
	if (["off", "false", "no", "negative", "n"].indexOf(str) != -1) return false;
	return Boolean(str);
};

const parseJSON = text => {
	return new Promise((resolve, reject) => {
		let out;
		try {
			out = JSON.parse(text);
		} catch (err) {
			reject();
		} finally {
			resolve(out);
		}
	});
};

const deleteFile = path => {
	fs.unlink(path, err => {
		if (err) throw err;
	});
};

const parseValue = (args, validList) => {
	for (const param in args) {
		if (validList.indexOf(param) != -1) {
			const value = args[param];
			return typeof value == "object" ? value[value.length - 1] : value;
		}
	}
	return undefined;
};

const getFileSize = path => {
	let fileSizeInBytes = fs.statSync(path)["size"];
	//Convert the file size to megabytes (optional)
	let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	return Math.round(fileSizeInMegabytes);
};

const subname = text => {
	return text
		.split(".")
		.slice(0, -1)
		.join(".");
};

const textTruncate = function(str, length, ending) {
	if (length == null) {
		length = 100;
	}
	if (ending == null) {
		ending = "...";
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
};

const numbers = ["z", "o", "t", "h", "f", "i", "s", "e", "g", "n"];

const numbersToWords = function(number) {
	let str = number.toString();
	for (let i = 0; i < 10; i++) {
		str = str.replace(new RegExp(i, "g"), numbers[i]);
	}
	return str;
};

const currencyFormat = function(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const slicePluginName = text => {
	return text
		.split(" ")
		.slice(1)
		.join(" ");
};

const apiErrorHandler = (api, log, parent, mssg, err) => {
	if (err) {
		const replyMsg = `Đã gặp lỗi "${err.errorDescription}" khi đang gửi tin nhắn`;
		api.sendMessage(replyMsg, mssg.threadID);
		log(
			{
				text: replyMsg,
				icon: "exclamation-triangle",
				bg: "bg3"
			},
			parent
		);
	}
};

const removeSpecialChar = function(str) {
	if (str === null || str === "") return false;
	else str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, "");
	// return str;
};

module.exports = {
	log,
	lower,
	upper,
	round,
	extend,
	subname,
	parseArg,
	parseBool,
	parseJSON,
	deleteFile,
	parseValue,
	getFileSize,
	textTruncate,
	numbersToWords,
	currencyFormat,
	slicePluginName,
	apiErrorHandler,
	removeSpecialChar
};
