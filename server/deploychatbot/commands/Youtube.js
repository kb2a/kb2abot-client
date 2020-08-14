import YoutubeMp3Downloader from "youtube-mp3-downloader";
import ytSearch from "yt-search";
import uniqid from "uniqid";
import path from "path";
import os from "os";
import fs from "fs";
import {
	log
} from "../../helper/helper.js";
import {
	round,
	musicPath,
	ffmpegPath,
	parseValue,
	deleteFile,
	checkError,
	parseBool
} from "../../helper/helperCommand.js";
import Command from "./Command.js";

class Youtube extends Command {
	constructor() {
		super({
			keywords: ["yt", "youtube"],
			help: "[--play=<videoID> | -p <videoID>] [--search=<videoName> | -s <videoName>] [--autodelete=<boolean>]",
			description: "Tải hoặc tìm kiếm nhạc mp3 trên youtube"
		});
		this.autoDelete = true;
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);

		const id = parseValue(args, ["play", "p"]);
		const search = parseValue(args, ["search", "s"]);
		const autoDelete = parseValue(args, ["autodelete"]);

		const start = Date.now();
		const filename = `${uniqid()}.mp3`;

		if (id) {
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
					log({
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
						checkError(api, log, parent, mssg.threadID, err);
						if (this.autoDelete) {
							deleteFile(path.join(musicPath, filename));
						}
					});
					log({
						text: replyMsg,
						icon: "youtube",
						bg: "bg1"
					}, parent);
				}
			});
			YD.on("error", (error) => {
				const replyMsg = `Đã gặp lỗi '${JSON.stringify(error)}' với id: ${id}`;
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			});
			api.sendMessage(`Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`, mssg.threadID);
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
				log({
					text: replyMsg,
					icon: "search",
					bg: "bg1"
				}, parent);
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
				log({
					text: `Có lỗi trong quá trình get video (${id})`,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			}
		}); */
	}
}

export default Youtube;
