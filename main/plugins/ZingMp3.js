const request = require("request");
const uniqid = require("uniqid");
const axios = require("axios");
const path = require("path");
const os = require("os");
const fs = require("fs");

const API_SIG =
	"b92dd121d84c5597d770896c7a93e60f03247b50828bdf1012b5da052951c74c22f9db6072ec5b942546114dbd3a773d79d675f9e668cf1e9a31af37c9aa2efa";
const API_KEY = "38e8643fb0dc04e8d65b99994d3dafff";
const {parseValue, parseArg, deleteFile, getFileSize} = kb2abot.utils;
const {getDownloadUrl, addMusicInfo, getMusicInfo} = kb2abot.utils.ZingMp3;
const musicPath = path.join(__dirname, "../../musics");
const store = [];

module.exports = {
	type: "normal",
	friendlyName: "zing mp3",
	keywords: ["zingmp3"],
	description: "Tải hoặc tìm kiếm nhạc mp3 trên ZingMp3",
	extendedDescription:
		"/zingmp3 [--play=<musicID> | -p <musicID>] [--search=<musicName> | -s <musicName>]",
	fn: async function(api, message) {
		const args = parseArg(message.body, "א");
		const search = parseValue(args, ["search", "s"]);
		const play = parseValue(args, ["play", "p"]);

		if (search) {
			const song = search;
			try {
				const songData = (
					await axios.get(
						`https://zingmp3.vn/api/search/multi?q=${encodeURI(
							song
						)}&ctime=1593161576&sig=${API_SIG}&api_key=${API_KEY}`
					)
				).data.data.song;
				if (!songData["total"]) {
					const replyMsg = `Không tìm thấy bài hát nào có tên: ${song}`;
					api.sendMessage(replyMsg, message.threadID);
					return;
				}
				const length = songData.items.length > 10 ? 10 : songData.items.length;
				let replyMsg = `Kết quả tìm thấy: ${songData.items.length}${os.EOL}Danh sách id các bài hát:${os.EOL}`;
				for (let i = 0; i < length; i++) {
					let {id, title, artists_names} = songData.items[i];
					replyMsg =
						replyMsg +
						`${i + 1}. Title: ${title}, artist: ${artists_names}, id: ${id}${os.EOL}`;
					addMusicInfo(songData.items[i], store);
				}
				api.sendMessage(replyMsg, message.threadID);
			} catch (e) {
				const replyMsg = `Có lỗi khi tìm kiếm (${song})${os.EOL}${e.message}`;
				api.sendMessage(replyMsg, message.threadID);
			}
		}
		if (play) {
			const start = Date.now();
			const id = play;
			api.sendMessage(
				`Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
				message.threadID
			);
			try {
				const url = await getDownloadUrl(id);
				const filename = `${uniqid()}.mp3`;
				request(url)
					.pipe(fs.createWriteStream(path.join(musicPath, filename)))
					.on("finish", () => {
						let fileSize = getFileSize(path.join(musicPath, filename));
						if (fileSize > 50) {
							const replyMsg = `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>25MB)`;
							api.sendMessage(replyMsg, message.threadID);
						} else {
							let replyMsg = "";
							const songInfo = getMusicInfo(id, store);
							const timeGet = (Date.now() - start) / 1000;

							if (!songInfo) replyMsg = `${id} (${timeGet}s)`;
							else
								replyMsg = `Bài hát: ${songInfo.title}${os.EOL}Tác giả: ${songInfo.artists_names}${os.EOL}Get nhạc trong ${timeGet}s`;

							api.sendMessage(
								{
									body: replyMsg,
									attachment: fs.createReadStream(path.join(musicPath, filename))
								},
								message.threadID,
								() => {
									deleteFile(path.join(musicPath, filename));
								}
							);
						}
					});
			} catch (e) {
				setTimeout(() => {
					const replyMsg = `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})${os.EOL}`;
					api.sendMessage(replyMsg, message.threadID);
				}, 100);
			}
		}
	}
};
