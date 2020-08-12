import request from "request";
import path from "path";
import fs from "fs";

const round = function(number, amount) {
	return parseFloat(Number(number).toFixed(amount));
};

const getDownloadUrl = async function(id) {
	return new Promise((resolve, reject) => {
		request.get(`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`, function(err, res, body) {
			if (err || !body) {
				reject();
			} else {
				resolve(res.request.uri.href);
			}
		});
	});
};

const getFileSize = function(path) {
	let fileSizeInBytes = fs.statSync(path)["size"];
	//Convert the file size to megabytes (optional)
	let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	return Math.round(fileSizeInMegabytes);
};

const musicPath = path.join(__dirname, "/../../musics");

const ffmpegPath = path.join(__dirname, "/../../ffmpeg-binary/bin/ffmpeg.exe");

const parseBool = function(str) {
	if (["on", "true", "yes", "positive", "t"].indexOf(str) != -1) {
		return true;
	}
	if (["off", "false", "no", "negative", "n"].indexOf(str) != -1)
		return false;
	return Boolean(str);
};

const checkError = function(api, log, parent, mssg, err) {
	if (err) {
		const replyMsg = `Đã gặp lỗi "${err.errorDescription}" khi đang gửi tin nhắn`;
		api.sendMessage(replyMsg, mssg.threadID);
		log({
			text: replyMsg,
			icon: "exclamation-triangle",
			bg: "bg3"
		}, parent);
	}
};

const deleteFile = function(path) {
	fs.unlink(path, err => {
		if (err) throw err;
	});
};

const parseValue = function(args, validList) {
	for (const param in args) {
		if (validList.indexOf(param) != -1) {
			const value = args[param];
			return (typeof(value) == "object") ? value[value.length - 1] : value;
		}
	}
	return undefined;
};

const isNoParam = function(args) {
	for (const param in args) {
		if (param) {
			return false;
		}
	}
	return true;
};

export {
	round,
	getDownloadUrl,
	getFileSize,
	musicPath,
	ffmpegPath,
	parseBool,
	checkError,
	deleteFile,
	parseValue,
	isNoParam
};
