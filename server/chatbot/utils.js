import request from "request";
import fs from "fs";

class Log {
	constructor({
		text,
		icon,
		bg = "bg1"
	} = {}) {
		this.text = text;
		this.icon = icon;
		this.bg = bg;
		this.dateCreated = Date.now();
	}

	toLocaleString() {
		return new Date(this.dateCreated).toLocaleString("en-GB");
	}
}

function logST(logConfig, account) {
	// if (!account.groupManager.listen)
	// return;
	console.log(logConfig.text);
	// let logs = account.chatbot.logs;
	// logs.push(new Log(logConfig));
	// account.decrypt();
}

function textTruncate(str, length, ending) {
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
}

async function getDownloadUrl(id) {
	return new Promise((resolve, reject) => {
		request.get(`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`, function(err, res, body) {
			if (err || !body) {
				reject();
			} else {
				resolve(res.request.uri.href);
			}
		});
	});
}

function addMusicInfo(data, musicsInfo) {
	let {
		id,
		title,
		artists_names
	} = data;
	let index = musicsInfo.findIndex(e => e.id == id);

	if (index == -1) {
		musicsInfo.push({
			id,
			title,
			artists_names
		});
	} else {
		Object.assign(musicsInfo[index], {
			id,
			title,
			artists_names
		});
	}
}

function getMusicInfo(id, musicsInfo) {
	let index = musicsInfo.findIndex(e => e.id == id);
	if (index != -1)
		return musicsInfo[index];
	else
		return null;
}

function getFileSize(path) {
	let fileSizeInBytes = fs.statSync(path)["size"];
	//Convert the file size to megabytes (optional)
	let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	return Math.round(fileSizeInMegabytes);
}

const numbers = ["z", "o", "t", "h", "f", "i", "s", "e", "g", "n"];

function NumbersToWords(number) {
	let str = number.toString();
	for (let i = 0; i < 10; i++) {
		str = str.replace(new RegExp(i, "g"), numbers[i]);
	}
	return str;
}

function addComma(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeSpecialChar(str) {
	if ((str === null) || (str === ""))
		return false;
	else
		str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, "");
	// return str;
}

function generateAppState(facebookCookie, messengerCookie) {
	const combine = facebookCookie.concat(messengerCookie);

	const appState = [];
	for (let cookieElement of combine) {
		appState.push({
			key: cookieElement.name,
			value: cookieElement.value,
			expires: cookieElement.expirationDate || "",
			domain: cookieElement.domain.replace(".", ""),
			path: cookieElement.path
		});
	}
	return appState;
}

export {
	logST,
	textTruncate,
	getDownloadUrl,
	addMusicInfo,
	getMusicInfo,
	getFileSize,
	NumbersToWords,
	addComma,
	removeSpecialChar,
	generateAppState
};
