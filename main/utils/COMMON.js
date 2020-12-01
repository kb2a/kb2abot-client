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

const subname = text => {
	return text.split(".").slice(0, -1).join(".");
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

const removeSpecialChar = function(str) {
	if (str === null || str === "") return false;
	else str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, "");
	// return str;
};

module.exports = {
	log,
	subname,
	parseArg,
	parseJSON,
	textTruncate,
	numbersToWords,
	currencyFormat,
	removeSpecialChar,
};
