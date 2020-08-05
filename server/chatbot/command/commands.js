import {
	logST,
	getDownloadUrl,
	getFileSize,
	round
} from "../utils.js";

import YoutubeMp3Downloader from "youtube-mp3-downloader";
import TicTacToe from "./game/tictactoe.js";
import ytSearch from "yt-search";
import uniqid from "uniqid";
import axios from "axios";
import path from "path";
import os from "os";
import fs from "fs";

const ffmpegPath = path.join(__dirname, "/../../../ffmpeg-binary/bin/ffmpeg");
const musicPath = path.join(__dirname, "/../../../musics");

class Command {
	constructor({
		keywords
	} = {}) {
		this.keywords = (typeof(keywords) == "object" ? keywords : [keywords]);
	}

	execute(args, api, parent, mssg, group) {
		delete args["_"]; // no need toz use arg._
	}

	checkError(api, logST, parent, threadID, err) {
		if (err) {
			const replyMsg = `Đã gặp lỗi "${err.errorDescription}" khi đang gửi tin nhắn`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "exclamation-triangle",
				bg: "bg3"
			}, parent);
		}
	}

	deleteFile(path) {
		fs.unlink(path, err => {
			if (err) throw err;
		});
	}

	parseValue(args, validList) {
		for (const param in args) {
			if (validList.indexOf(param) != -1) {
				const value = args[param];
				return (typeof(value) == "object") ? value[value.length - 1] : value;
			}
		}
		return undefined;
	}
}

class SwitchStatus extends Command {
	constructor() {
		super({
			keywords: "switch"
		});
	}

	translate(str) {
		if (["on", "true", "yes", "positive", "1", "t"].indexOf(str) != -1) {
			return true;
		}
		return false;
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		for (const param in args) {
			if (group.hasOwnProperty(param)) {
				const value = this.translate(this.parseValue(args, [param]));
				const replyMsg = `${param.toUpperCase()} has changed to [${value}]`;
				group[param] = value;
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
					text: replyMsg,
					icon: "language",
					bg: "bg2"
				}, parent);
			}
		}
	}
}

class Help extends Command {
	constructor() {
		super({
			keywords: ["help", "h"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const replyMsg = `Danh sách các câu lệnh hợp lệ: ${os.EOL}/lang [en/vi/zh/...]${os.EOL}/chat [on/off]${os.EOL}/emote [on/off]${os.EOL}/add [id]${os.EOL}/delete [id]${os.EOL}/mute [id] [second] [reason]${os.EOL}/weather setdefault [địa điểm]${os.EOL}/weather [địa điểm] (nếu không có địa điểm thì sẽ search theo default weather của group)${os.EOL}/music [search/play] [tên bài hát (ko dấu)/ ID của bài hát] search để tìm kiếm bài hát sau đó lấy id để xài lệnh /music play${os.EOL}/yt [id] là get nhạc theo id của youtube`;
		api.sendMessage(replyMsg, mssg.threadID);
	}
}

class Count extends Command {
	constructor() {
		super({
			keywords: "count"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const global = this.parseValue(args, ["g", "global"]);
		const id = this.parseValue(args, ["i", "id"]);

		if (global) {
			const replyMsg = `Tổng số tin nhắn trong group: ${group.messagesCount}`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "calculator",
				bg: "bg1"
			}, parent);
		}

		if (id) {
			const member = group.memberManager.find(id);
			if (member) {
				const replyMsg = `Tổng số tin nhắn của ${member.name}: ${member.messagesCount}`;
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
					text: replyMsg,
					icon: "calculator",
					bg: "bg1"
				}, parent);
			}
		}
	}
}

class Rank extends Command {
	constructor() {
		super({
			keywords: "rank"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);

		const upward = this.parseValue(args, ["u", "upward"]);
		const global = this.parseValue(args, ["g", "global"]);
		const id = this.parseValue(args, ["i", "id"]);

		const sortItem = args.item ? args.item : "messagesCount";

		if (upward) {
			group.sortRank(sortItem, true);
		} else {
			group.sortRank(sortItem, false);
		}

		if (global) {
			let replyMsg = "";
			const listMember = group.memberManager.items;
			const length = listMember.length > 10 ? 10 : listMember.length;
			for (let i = 0; i < length; i++) {
				const {
					name
				} = listMember[i];
				if (!listMember[i].hasOwnProperty(sortItem))
					return;
				replyMsg += `Top ${i+1} là: ${name} (${listMember[i][sortItem]}) ${os.EOL}`;
			}
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "sort-amount-up",
				bg: "bg1"
			}, parent);
		}

		if (id) {
			let rank = group.memberManager.find(id);
			if (rank == -1)
				rank = "không có";
			const name = group.memberManager.find(id, true).name;
			const replyMsg = `Rank của ${name} trong group là ${rank}!`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "sort-amount-up",
				bg: "bg1"
			}, parent);
		}
	}
}

class Weather extends Command {
	constructor() {
		super({
			keywords: ["weather", "wea"]
		});
		this.WEATHER_KEY = "9e41bc31443314a1c5ad9695f2e9f9d1";
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const setDefault = this.parseValue(args, ["set", "s"]);
		let location = this.parseValue(args, ["location", "loc", "l"]);

		// list all cities in vietnam
		// https://www.back4app.com/database/back4app/list-of-cities-in-vietnam/dataset-

		if (setDefault) {
			group.location = setDefault;
			const replyMsg = `Đã set location cho group là ${group.location}`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "check",
				bg: "bg2"
			}, parent);
		}

		if (!location) {
			if (!group.location) {
				const replyMsg = "Bạn chưa đặt vị trí mặc định cho group, hãy xài lệnh: /weather --set \"[location]\"";
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
					text: replyMsg,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
				return;
			} else {
				location = group.location;
			}
		}
		axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&APPID=${this.WEATHER_KEY}`).then(response => {
			const {
				weather,
				main,
				name
			} = response.data;
			const replyMsg = `Name: ${name}${os.EOL}Weather: ${weather[0].main}(${weather[0].description})${os.EOL}Temperature: ${Math.round(main.temp_min-273)}°C ~ ${Math.round(main.temp_max-273)}°C`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "cloud-sun",
				bg: "bg1"
			}, parent);
		}).catch((e) => {
			const replyMsg = `Không tìm thấy địa điểm nào có tên: ${location}`;
			api.sendMessage(replyMsg, mssg.threadID);
			logST({
				text: replyMsg,
				icon: "exclamation-triangle",
				bg: "bg3"
			}, parent);
		});
	}
}

class Youtube extends Command {
	constructor() {
		super({
			keywords: ["yt", "youtube"]
		});
		this.autoDelete = false;
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);

		const id = this.parseValue(args, ["play", "p"]);
		const search = this.parseValue(args, ["search", "s"]);

		const start = Date.now();
		const filename = `${uniqid()}.mp3`;

		if (id) {
			api.sendMessage(`Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`, mssg.threadID);
			const YD = new YoutubeMp3Downloader({
				"ffmpegPath": ffmpegPath, // FFmpeg binary location
				"outputPath": musicPath, // Output file location (default: the home directory)
				"youtubeVideoQuality": "highestaudio", // Desired video quality (default: highestaudio)
				"queueParallelism": 3, // Download parallelism (default: 1)
			});
			YD.download(id, filename);
			YD.on("finished", (err, data) => {
				const {
					videoTitle,
					artist,
					stats
				} = data;
				const fileSize = round(stats.averageSpeed / 1024 / 1024, 1);
				if (fileSize > 100) {
					const replyMsg = `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>100MB)`;
					api.sendMessage(replyMsg, mssg.threadID);
					logST({
						text: replyMsg,
						icon: "exclamation-triangle",
						bg: "bg3"
					}, parent);
				} else {
					const timeGet = (Date.now() - start) / 1000;
					const replyMsg = `Tiêu đề: ${videoTitle}${os.EOL}Nhạc sĩ: ${artist}${os.EOL}Get nhạc trong ${timeGet}s${os.EOL}Dung lượng: ${round(stats.transferredBytes/1024/1024, 1)}mb${os.EOL}Tốc độ tải: ${fileSize}mb/s`;
					api.sendMessage({
						body: replyMsg,
						attachment: fs.createReadStream(path.join(musicPath, filename))
					}, mssg.threadID, err => {
						this.checkError(api, logST, parent, mssg.threadID, err);
						if (this.autoDelete) {
							this.deleteFile(path.join(musicPath, filename));
						}
					});
					logST({
						text: replyMsg,
						icon: "youtube",
						bg: "bg1"
					}, parent);
				}
			});
			YD.on("error", (error) => {
				const replyMsg = `Đã gặp lỗi '${JSON.stringify(error)}' với id: ${id}`;
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
					text: replyMsg,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			});
		}

		if (search) {
			ytSearch(search, (err, r) => {
				if (err) throw err;
				let replyMsg = "";
				const videos = r.videos;
				const length = videos.length > 10 ? 10 : videos.length;
				for (let i = 0; i < length; i++) {
					const {
						title,
						videoId
					} = videos[i];
					replyMsg += `${i+1}. Tiêu đề: ${title}, id: ${videoId}${os.EOL}`;
				}
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
					text: replyMsg,
					icon: "search",
					bg: "bg1"
				}, parent);
			});
		}


		/* request(url, (error, response) => {
			let res = response.toJSON();
			if (res.statusCode == "200") {
				let {
					name,
					duration,
					link
				} = JSON.parse(res.body).data;
				const indexVideo = uniqueIndexVideo++;
				request(link).pipe(fs.createWriteStream(`./musics/${id}${indexVideo}.mp3`)).on("finish", function() {
					let fileSize = getFileSize(`./musics/${id}${indexVideo}.mp3`);

			} else {
				sendMessage({
					text: `Có lỗi trong quá trình get video (${id})${os.eol}`,
					mssg.threadID
				});
				logST({
					text: `Có lỗi trong quá trình get video (${id})`,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			}
		}); */
	}
}

class ZingMp3 extends Command {
	constructor() {
		super({
			keywords: ["zingmp3", "zing", "z"]
		});
		this.MP3_SIG = "b92dd121d84c5597d770896c7a93e60f03247b50828bdf1012b5da052951c74c22f9db6072ec5b942546114dbd3a773d79d675f9e668cf1e9a31af37c9aa2efa";
		this.MP3_KEY = "38e8643fb0dc04e8d65b99994d3dafff";
		this.musicsInfo = [];
		this.autoDelete = false; // you can delete the music if you want
	}

	addMusicInfo(data) {
		const {
			id,
			title,
			artists_names
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

		const search = this.parseValue(args, ["search", "s"]);
		const play = this.parseValue(args, ["play", "p"]);

		if (search) {
			axios.get(`https://zingmp3.vn/api/search/multi?q=${encodeURI(search)}&ctime=1593161576&sig=${this.MP3_SIG}&api_key=${this.MP3_KEY}`).then(response => {
				const songData = response.data.data.song;

				if (!songData.hasOwnProperty("total")) {
					const replyMsg = `Không tìm thấy bài hát nào có tên: ${search}`;
					api.sendMessage(replyMsg, mssg.threadID);
					logST({
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
				logST({
					text: replyMsg,
					icon: "search",
					bg: "bg1"
				}, parent);
			}).catch(() => {
				const replyMsg = `Có lỗi khi tìm kiếm (${song})`;
				api.sendMessage(replyMsg, mssg.threadID);
				logST({
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
				const filename = uniqid + ".mp3";
				request(url).pipe(fs.createWriteStream(path.join(musicPath, filename))).on("finish", () => {
					let fileSize = getFileSize(path.join(musicPath, filename));
					if (fileSize > 50) {
						const replyMsg = `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>25MB)`;
						api.sendMessage(replyMsg, mssg.threadID);
						logST({
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
							this.checkError(api, logST, parent, mssg.threadID, err);
							if (this.autoDelete)
								this.deleteFile(path.join(musicPath, filename));
						});
						logST({
							text: replyMsg,
							icon: "music",
							bg: "bg1"
						}, parent);
					}
				});
			}).catch(() => {
				setTimeout(() => {
					const replyMsg = `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`;
					api.sendMessage(replyMsg, mssg.threadID);
					logST({
						text: replyMsg,
						icon: "exclamation-triangle",
						bg: "bg3"
					}, parent);
				}, 100);
			});
		}
	}
}

class Everyone extends Command {
	constructor() {
		super({
			keywords: ["all", "everyone", "everybody"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		let replyMsg = "";
		const mentions = [];
		for (const member of group.memberManager.items) {
			let tag = `@${member.name} `;
			replyMsg += tag;
			mentions.push({
				tag,
				id: member.id,
				fromIndex: replyMsg.length - tag.length
			});
		}
		api.sendMessage({
			body: replyMsg,
			mentions
		}, mssg.threadID);
	}
}

class Data extends Command {
	constructor() {
		super({
			keywords: ["debug", "data"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const item = this.parseValue(args, ["item", "it", "i"]);
		const all = this.parseValue(args, ["all", "a"]);
		if (group.hasOwnProperty(item)) {
			const replyMsg = `\`\`\`${os.EOL}${JSON.stringify(group[item])}${os.EOL}\`\`\``;
			api.sendMessage(replyMsg, mssg.threadID);
		}
		if (all) {
			const replyMsg = `\`\`\`${os.EOL}${JSON.stringify(group)}${os.EOL}\`\`\``;
			api.sendMessage(replyMsg, mssg.threadID);
		}
	}
}

class Game extends Command {
	constructor() {
		super({
			keywords: ["game", "g"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const replyMsg = `Game tictactoe :v  ${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`;
		api.sendMessage(replyMsg, mssg.threadID);
		group.gaming = true;
		group.game.tictactoe = new TicTacToe();
	}
}

export {
	SwitchStatus,
	Help,
	Count,
	Rank,
	Weather,
	Youtube,
	ZingMp3,
	Everyone,
	Data,
	Game
};
