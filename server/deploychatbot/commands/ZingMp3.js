import request from "request";
import uniqid from "uniqid";
import axios from "axios";
import path from "path";
import os from "os";
import fs from "fs";
import Command from "./Command.js";
import {
	log
} from "../../helper/helper.js";
import {
	getDownloadUrl,
	getFileSize,
	musicPath,
	parseValue,
	deleteFile,
	checkError,
	parseBool
} from "../../helper/helperCommand.js";

class ZingMp3 extends Command {
	constructor() {
		super({
			keywords: ["zingmp3", "zing", "z"],
			help: "[--play=<musicID> | -p <musicID>] [--search=<musicName> | -s <musicName>] [--autodelete=<boolean>]",
			description: "Tải hoặc tìm kiếm nhạc mp3 trên ZingMp3"
		});
		this.MP3_SIG = "b92dd121d84c5597d770896c7a93e60f03247b50828bdf1012b5da052951c74c22f9db6072ec5b942546114dbd3a773d79d675f9e668cf1e9a31af37c9aa2efa";
		this.MP3_KEY = "38e8643fb0dc04e8d65b99994d3dafff";
		this.musicsInfo = [];
		this.autoDelete = true; // you can delete the music if you want
	}

	addMusicInfo(data) {
		const {
			id
		} = data;
		let index = this.musicsInfo.findIndex(e => e.id == id);
		if (index == -1) {
			this.musicsInfo.push(data);
		} else {
			Object.assign(this.musicsInfo[index], data);
		}
	}

	getMusicInfo(id) {
		const index = this.musicsInfo.findIndex(e => e.id == id);
		if (index != -1)
			return this.musicsInfo[index];
		else
			return null;
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);

		const search = parseValue(args, ["search", "s"]);
		const play = parseValue(args, ["play", "p"]);
		const autoDelete = parseValue(args, ["autodelete"]);

		if (search) {
			const song = search;
			axios.get(`https://zingmp3.vn/api/search/multi?q=${encodeURI(song)}&ctime=1593161576&sig=${this.MP3_SIG}&api_key=${this.MP3_KEY}`).then(response => {
				const songData = response.data.data.song;

				if (!songData.hasOwnProperty("total")) {
					const replyMsg = `Không tìm thấy bài hát nào có tên: ${song}`;
					api.sendMessage(replyMsg, mssg.threadID);
					log({
						text: replyMsg,
						icon: "exclamation-triangle",
						bg: "bg3"
					}, parent);
					return;
				}
				const length = (songData.items.length > 10 ? 10 : songData.items.length);
				let replyMsg = `Kết quả tìm thấy: ${songData.items.length}${os.EOL}Danh sách id các bài hát:${os.EOL}`;
				for (let i = 0; i < length; i++) {
					let {
						id,
						title,
						artists_names
					} = songData.items[i];
					replyMsg = replyMsg + `${i+1}. Title: ${title}, artist: ${artists_names}, id: ${id}${os.EOL}`;
					this.addMusicInfo(songData.items[i]);
				}
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "search",
					bg: "bg1"
				}, parent);
			}).catch(() => {
				const replyMsg = `Có lỗi khi tìm kiếm (${song})`;
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			});
		}
		if (play) {
			const start = Date.now();
			const id = play;
			api.sendMessage(`Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`, mssg.threadID);
			getDownloadUrl(id).then(url => {
				const filename = `${uniqid()}.mp3`;
				request(url).pipe(fs.createWriteStream(path.join(musicPath, filename))).on("finish", () => {
					let fileSize = getFileSize(path.join(musicPath, filename));
					if (fileSize > 50) {
						const replyMsg = `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>25MB)`;
						api.sendMessage(replyMsg, mssg.threadID);
						log({
							text: replyMsg,
							icon: "exclamation-triangle",
							bg: "bg3"
						}, parent);
					} else {
						let replyMsg = "";
						const songInfo = this.getMusicInfo(id);
						const timeGet = (Date.now() - start) / 1000;

						if (!songInfo)
							replyMsg = `${id} (${timeGet}s)`;
						else
							replyMsg = `Bài hát: ${songInfo.title}${os.EOL}Tác giả: ${songInfo.artists_names}${os.EOL}Get nhạc trong ${timeGet}s`;

						api.sendMessage({
							body: replyMsg,
							attachment: fs.createReadStream(path.join(musicPath, filename))
						}, mssg.threadID, err => {
							checkError(api, log, parent, mssg.threadID, err);
							if (this.autoDelete)
								deleteFile(path.join(musicPath, filename));
						});
						log({
							text: replyMsg,
							icon: "music",
							bg: "bg1"
						}, parent);
					}
				});
			}).catch((err) => {
				console.log(err);
				setTimeout(() => {
					const replyMsg = `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`;
					api.sendMessage(replyMsg, mssg.threadID);
					log({
						text: replyMsg,
						icon: "exclamation-triangle",
						bg: "bg3"
					}, parent);
				}, 100);
			});
		}
		if (autoDelete) {
			if (autoDelete === true) {
				this.autoDelete = !this.autoDelete;
			} else {
				this.autoDelete = parseBool(autoDelete);
			}
			const replyMsg = `Đã chuyển autoDelete sang trạng thái: ${this.autoDelete}`;
			api.sendMessage(replyMsg, mssg.threadID);
		}
	}
}

export default ZingMp3;
