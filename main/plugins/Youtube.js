const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ytSearch = require("yt-search");
const ffmpeg = require("ffmpeg-cli");
const uniqid = require("uniqid");
const path = require("path");
const os = require("os");
const fs = require("fs");
const {round, parseValue, deleteFile, parseArg} = kb2abot.utils;
const musicPath = path.join(__dirname, "../../musics");

module.exports = {
	type: "normal",
	friendlyName: "mp3 youtube",
	keywords: ["ytmp3"],
	description: "Tải hoặc tìm kiếm nhạc mp3 trên youtube",
	extendedDescription:
		"/ytmp3 [--play=<videoID> | -p <videoID>] [--search=<videoName> | -s <videoName>]",
	fn: async function(api, message) {
		const args = parseArg(message.body, "א");
		const id = parseValue(args, ["play", "p"]);
		const search = parseValue(args, ["search", "s"]);

		const start = Date.now();
		const filename = `${uniqid()}.mp3`;

		if (id) {
			if (!/^[a-zA-Z0-9-_]{11}$/.test(id)) {
				api.sendMessage("ID không hợp lệ!", message.threadID);
				return;
			}
			const YD = new YoutubeMp3Downloader({
				ffmpegPath: ffmpeg.path, // FFmpeg binary location
				outputPath: musicPath, // Output file location (default: the home directory)
				youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
				queueParallelism: 3 // Download parallelism (default: 1)
			});
			YD.download(id, filename);
			YD.on("finished", (err, data) => {
				const {videoTitle, artist, stats} = data;
				const fileSize = round(stats.averageSpeed / 1024 / 1024, 1);
				if (fileSize > 100) {
					const replymessage = `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>100MB)`;
					api.sendMessage(replymessage, message.threadID);
				} else {
					const timeGet = (Date.now() - start) / 1000;
					const replymessage = `Tiêu đề: ${videoTitle}${os.EOL}Nhạc sĩ: ${artist}${
						os.EOL
					}Get nhạc trong ${timeGet}s${os.EOL}Dung lượng: ${round(
						stats.transferredBytes / 1024 / 1024,
						1
					)}mb${os.EOL}Tốc độ tải: ${fileSize}mb/s`;
					api.sendMessage(
						{
							body: replymessage,
							attachment: fs.createReadStream(path.join(musicPath, filename))
						},
						message.threadID,
						() => {
							if (this.autoDelete) {
								deleteFile(path.join(musicPath, filename));
							}
						}
					);
				}
			});
			YD.on("error", error => {
				const replymessage = `Đã gặp lỗi '${JSON.stringify(error)}' với id: ${id}`;
				api.sendMessage(replymessage, message.threadID);
			});
			api.sendMessage(
				`Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
				message.threadID
			);
		}

		if (search) {
			ytSearch(search, (err, r) => {
				if (err) throw err;
				let replymessage = "";
				const videos = r.videos;
				const length = videos.length > 10 ? 10 : videos.length;
				for (let i = 0; i < length; i++) {
					const {title, videoId} = videos[i];
					replymessage += `${i + 1}. Tiêu đề: ${title}, id: ${videoId}${os.EOL}`;
				}
				api.sendMessage(replymessage, message.threadID);
			});
		}
	}
};
