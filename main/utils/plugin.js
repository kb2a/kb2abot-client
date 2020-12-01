const request = require("request");
const path = require("path");
const fs = require("fs");

const round = (number, amount) => {
	return parseFloat(Number(number).toFixed(amount));
};

const getDownloadUrl = async id => {
	return new Promise((resolve, reject) => {
		request.get(
			`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`,
			(err, res, body) => {
				if (err || !body) {
					reject();
				} else {
					resolve(res.request.uri.href);
				}
			}
		);
	});
};

const getFileSize = path => {
	let fileSizeInBytes = fs.statSync(path)["size"];
	//Convert the file size to megabytes (optional)
	let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	return Math.round(fileSizeInMegabytes);
};

const musicPath = path.join(__dirname, "/../../musics");

const ffmpegPath = path.join(__dirname, "/../../ffmpeg-binary/bin/ffmpeg.exe");

const parseBool = str => {
	if (["on", "true", "yes", "positive", "t"].indexOf(str) != -1) {
		return true;
	}
	if (["off", "false", "no", "negative", "n"].indexOf(str) != -1)
		return false;
	return Boolean(str);
};

const checkError = (api, log, parent, mssg, err) => {
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

const hasHelpParam = args => {
	if (parseValue(args, ["help", "h"])) {
		return true;
	}
	return false;
};

const hasNoParam = args => {
	if (parseValue(args, ["help", "h"])) {
		return true;
	}
	return false;
};

module.exports = {
	round,
	getDownloadUrl,
	getFileSize,
	musicPath,
	ffmpegPath,
	parseBool,
	checkError,
	deleteFile,
	parseValue,
	hasHelpParam,
	hasNoParam
};
