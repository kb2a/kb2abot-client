import {
    logST,
    getDownloadUrl,
    addMusicInfo,
    getMusicInfo,
    getFileSize
} from "./utils.js";

const KEYWORD_TO_STR = {
    true: "on",
    false: "off"
};

const STR_TO_KEYWORD = {
    "on": true,
    "off": false
};

const TRANS_KEY = "trnsl.1.1.20200421T120324Z.a5209d29ad08ae85.7328dad8e46f00dad4a4cdb9a911868d8ace112b"; // you can use your own yandex translate API KEY
const WEATHER_KEY = "9e41bc31443314a1c5ad9695f2e9f9d1";
const MITSUKU_THREADID = "47719737069";

const MP3_KEY = "38e8643fb0dc04e8d65b99994d3dafff";
const MP3_SIG = "b92dd121d84c5597d770896c7a93e60f03247b50828bdf1012b5da052951c74c22f9db6072ec5b942546114dbd3a773d79d675f9e668cf1e9a31af37c9aa2efa";

const whiteListGroup = [ // phần này để loại bỏ những group mà bạn không muốn bot hoạt động (tránh gây phiền hà)
    // 'whitelist id'
];

const emotes = ":3 🙂 😀 😞 😢 😛 😇 😈 o.O 😉 😮 😑  😠 😗 ❤ 😊 😎 😠 ♒ 😕 ♊ ☺ 󰀀 💩 ☀ ☁ ☔ ⚡ ✨ ⭐ ✳ ⛄ ☕ ♨ ⛵ ⛽ ✈ ⛲ ⛺ ⛪ ☎ ✉ ✂ 🚽 🛀 👙 👙 👕 👘 👗 👢 👠 👡 💼 👜 👔 🎩 👒 👑 💍 🚭 ⚽   ⚾ ⚾ ⛳ 🏈 🏀 🎾 🎱 🎯 🎿 🎌 🏁 🏆".split(" ");

import login from "facebook-chat-api";
import request from "request";
import random from "random";
import axios from "axios";
import fs from "fs";
import os from "os";

import {
    JSDOM
} from "jsdom";
const {
    window
} = new JSDOM("");
import JQ from "jquery";
const jquery = JQ(window);
import TicTacToe from "./game/tictactoe.js";

let uniqueIndexVideo = 0;

function deployChatbot(appState, parent) {
<<<<<<< HEAD
	login({
		appState: JSON.parse(appState)
	}, function(err, api) {

		let {
			groupManager,
			chatbot
		} = parent;
		let {
			queue,
			tempMusicsInfo
		} = chatbot;

		if (err) return console.log(err);

		let sendMessage = function(data, callback) {
			api.sendMessage(data.text, data.threadID, callback);
		};

		// saving cac thu
		parent.appState = JSON.stringify(api.getAppState());
		chatbot.err = err;
		chatbot.api = api;
		// --

		let ExecuteCommand = async function(command, params, mssg, group, callback) {
			// >>>> COMMAND CONFIG <<<<
			let {
				threadID,
				senderID
			} = mssg;
			switch (command) {
				case "lang":
					// If the language is unknown, the bot will not respond
					// Check this out: http://www.lingoes.net/en/translator/langcode.htm
					group.language = params[0].toLowerCase();

					sendMessage({
						text: `Language has changed to [${params[0]}]`,
						threadID
					});
					logST({
						text: `Đã chuyển sang ngôn ngữ ${params[0]} cho groupID: ${threadID}`,
						icon: "language",
						bg: "bg2"
					}, parent);
					break;

				case "chat":
					if (["toggle", "on", "off"].indexOf(params[0]) == -1)
						break;
					if (params[0] == "toggle")
						group.chat = !group.chat;
					else
						group.chat = STR_TO_KEYWORD[params[0]];
					sendMessage({
						text: `chat has changed to [${KEYWORD_TO_STR[group.chat]}]`,
						threadID
					});
					logST({
						text: `Đã chuyển chat chat sang ${KEYWORD_TO_STR[group.chat]} cho groupID: ${threadID}`,
						icon: "robot",
						bg: "bg2"
					}, parent);
					break;

				case "help":
					sendMessage({
						text: `Danh sách các câu lệnh hợp lệ: ${os.EOL}/lang [en/vi/zh/...]${os.EOL}/chat [on/off]${os.EOL}/emote [on/off]${os.EOL}/add [id]${os.EOL}/delete [id]${os.EOL}/mute [id] [second] [reason]${os.EOL}/weather setdefault [địa điểm]${os.EOL}/weather [địa điểm] (nếu không có địa điểm thì sẽ search theo default weather của group)${os.EOL}/music [search/play] [tên bài hát (ko dấu)/ ID của bài hát] search để tìm kiếm bài hát sau đó lấy id để xài lệnh /music play${os.EOL}/yt [id] là get nhạc theo id của youtube`,
						threadID
					});
					break;

				case "emote":
					if (["toggle", "on", "off"].indexOf(params[0]) == -1) {
						break;
					}
					if (params[0] == "toggle")
						group.emote = !group.emote;
					else
						group.emote = STR_TO_KEYWORD[params[0]];

					sendMessage({
						text: `Emote has changed to [${KEYWORD_TO_STR[group.emote]}]`,
						threadID
					});
					logST({
						text: `Đã chuyển emote sang status ${KEYWORD_TO_STR[group.emote]} cho groupID: ${threadID}`,
						icon: "kiss-beam",
						bg: "bg2"
					}, parent);
					break;

				case "add": {
					let userID = params[0];
					api.addUserToGroup(userID, threadID);
					logST({
						text: `Đã add ${group.memberManager.find(userID, true).name}(${userID}) vào group ${threadID}`,
						icon: "user-plus",
						bg: "bg2"
					}, parent);
					break;
				}

				case "delete": {
					let userID = params[0];
					if (userID == "100052638460826" || userID == "100007723935647")
						return;
					api.removeUserFromGroup(userID, threadID);
					logST({
						text: `Đã xóa ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}`,
						icon: "user-minus",
						bg: "bg2"
					}, parent);
					break;
				}

				case "mute": {
					let time = params[1];
					if (time <= 0)
						time = 1;
					let userID = params[0];
					let reason = params[2];
					let tempFunc = () => {
						ExecuteCommand("delete", [userID], mssg, group);
						setTimeout(() => {
							ExecuteCommand("add", [userID], mssg, group);
						}, time * 1000);
					};
					if (reason) {
						sendMessage({
							text: `Bị khóa mõm vì lí do: ${reason}${os.EOL}Thời gian lãnh án: ${time} giây!`,
							threadID
						}, tempFunc);
						logST({
							text: `Đã mute user ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}, lí do: ${reason}`,
							icon: "comment-slash",
							bg: "bg2"
						}, parent);
					} else {
						tempFunc();
					}
					break;
				}

				case "count": {
					let id = params[0];
					if (id == "group" || !id) {
						sendMessage({
							text: `Tổng số tin nhắn trong group: ${group.messagesCount}`,
							threadID
						});
						logST({
							text: `Tổng số tin nhắn trong group ${threadID}: ${group.messagesCount}`,
							icon: "calculator",
							bg: "bg1"
						}, parent);
					} else {
						let userData = await group.getUserData(api, id);
						let name = userData.name;
						let messagesCount = group.memberManager.find(id, true).messagesCount;
						sendMessage({
							text: `Tổng số tin nhắn của ${name}: ${messagesCount}`,
							threadID
						});
						logST({
							text: `Tổng số tin nhắn của ${name}: ${messagesCount}`,
							icon: "calculator",
							bg: "bg1"
						}, parent);
					}
					break;
				}

				case "rank": {
					let id = params[0];
					if (id == "all") {
						group.sortRank("messagesCount", false);
						let text = "";
						let listMember = group.memberManager.items;
						let length = listMember.length > 10 ? 10 : listMember.length;
						for (let i = 0; i < length; i++) {
							let name = (await group.getUserData(api, listMember[i].id)).name;
							group.memberManager.find(senderID, true, true).name = name;
							text = text + `Top ${i+1} là: ${name} (${group.memberManager.find(listMember[i].id, true, true).messagesCount}) ${os.EOL}`;
						}

						sendMessage({
							text,
							threadID
						});
						logST({
							text,
							icon: "sort-amount-up",
							bg: "bg1"
						}, parent);

					} else {
						let data = await group.checkRank(api, id);
						sendMessage({
							text: `Rank của ${data.name} trong group là ${data.rank}!`,
							threadID
						});
						logST({
							text: `Rank của ${data.name} trong group là ${data.rank}!`,
							icon: "sort-amount-up",
							bg: "bg1"
						}, parent);
					}
					break;
				}

				case "weather": {
					// list all cities in vietnam
					// https://www.back4app.com/database/back4app/list-of-cities-in-vietnam/dataset-api

					if (params[0] == "setdefault") {
						group.location = params[1];
						sendMessage({
							text: `Đã set weather default là ${params[1]}`,
							threadID
						});
						logST({
							text: `Đã set weather default là ${params[1]}`,
							icon: "check",
							bg: "bg2"
						}, parent);
					} else {
						let location;

						if (!params[0])
							location = group.location;
						else {
							location = params[0];
						}

						if (location)
							axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&APPID=${WEATHER_KEY}`).then(response => {
								let {
									weather,
									main,
									name
								} = response.data;
								let text = `Name: ${name}${os.EOL}Weather: ${weather[0].main}(${weather[0].description})${os.EOL}Temperature: ${Math.round(main.temp_min-273)}°C ~ ${Math.round(main.temp_max-273)}°C`;
								sendMessage({
									text,
									threadID
								});
								logST({
									text,
									icon: "cloud-sun",
									bg: "bg1"
								}, parent);
							})
							.catch((e) => {
								sendMessage({
									text: `Không tìm thấy địa điểm nào có tên: ${location}`,
									threadID
								});
								logST({
									text: `Không tìm thấy địa điểm nào có tên: ${location}`,
									icon: "exclamation-triangle",
									bg: "bg3"
								}, parent);
							});
						else {
							sendMessage({
								text: "Bạn chưa đặt weather default cho group, hãy xài lệnh: /weather setdefault [location]",
								threadID
							});
							logST({
								text: "Bạn chưa đặt weather default cho group, hãy xài lệnh: /weather setdefault [location]",
								icon: "exclamation-triangle",
								bg: "bg3"
							}, parent);
						}
					}
					break;
				}

				case "yt": {
					let id = params[0].replace(/ /g, "_"); // convert nguoc lai, vi id youtube co the co _
					let url = `http://api.kb2ateam.com/get-mp3?id=${id}`;
					let start = Date.now();
					sendMessage({
						text: `Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
						threadID
					});
					request(url, (error, response) => {
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
								if (fileSize > 50) {
									sendMessage({
										text: `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>50MB)`,
										threadID
									});
									logST({
										text: `Không thể gửi: dung lượng file quá lớn (${id})`,
										icon: "exclamation-triangle",
										bg: "bg3"
									}, parent);
								} else {
									let timeGet = (Date.now() - start) / 1000;
									let text = `Tiêu đề: ${name}${os.EOL}Thời lượng: ${duration}${os.EOL}Get nhạc trong ${timeGet}s`;
									api.sendMessage({
										body: text,
										attachment: fs.createReadStream(`./musics/${id}${indexVideo}.mp3`)
									}, threadID, err => {
										if (err) {
											sendMessage({
												text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
												threadID
											});
											logST({
												text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
												icon: "exclamation-triangle",
												bg: "bg3"
											}, parent);
										}
										// you can delete the music if you want
										fs.unlink(`./musics/${id}${indexVideo}.mp3`, err => {
											if (err) throw err;
										});
									});
									logST({
										text,
										icon: "youtube",
										bg: "bg1"
									}, parent);
								}
							});
						} else {
							sendMessage({
								text: `Có lỗi trong quá trình get video (${id})${os.eol}`,
								threadID
							});
							logST({
								text: `Có lỗi trong quá trình get video (${id})`,
								icon: "exclamation-triangle",
								bg: "bg3"
							}, parent);
						}
					});
					break;
				}

				case "music": {
					let method = params[0];
					switch (method) {
						case "search": {
							let song = params[1];
							axios.get(`https://zingmp3.vn/api/search/multi?q=${encodeURI(song)}&ctime=1593161576&sig=${MP3_SIG}&api_key=${MP3_KEY}`).then(response => {
									let songData = response.data.data.song;

									if (!songData.hasOwnProperty("total")) {
										sendMessage({
											text: `Không tìm thấy bài hát nào có tên: ${song}`,
											threadID
										});
										logST({
											text: `Không tìm thấy bài hát nào có tên: ${song}`,
											icon: "exclamation-triangle",
											bg: "bg3"
										}, parent);
										return;
									}
									let length = (songData.items.length > 10 ? 10 : songData.items.length);
									let text = `Kết quả tìm thấy: ${songData.items.length}${os.EOL}Danh sách id các bài hát:${os.EOL}`;
									for (let i = 0; i < length; i++) {
										let {
											id,
											title,
											artists_names
										} = songData.items[i];
										text = text + `${i+1}. Title: ${title}, artist: ${artists_names}, id: ${id}${os.EOL}`;
										addMusicInfo(songData.items[i], tempMusicsInfo);
									}
									sendMessage({
										text,
										threadID
									});
									logST({
										text,
										icon: "search",
										bg: "bg1"
									}, parent);
								})
								.catch(() => {
									sendMessage({
										text: `Có lỗi khi tìm kiếm (${song})`,
										threadID
									});
									logST({
										text: `Có lỗi khi tìm kiếm (${song})`,
										icon: "exclamation-triangle",
										bg: "bg3"
									}, parent);
								});

							break;
						}
						case "play": {
							let start = Date.now();
							let id = params[1].toUpperCase();
							sendMessage({
								text: `Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
								threadID
							});

							getDownloadUrl(id).then(url => {
									const indexVideo = uniqueIndexVideo++;
									request(url).pipe(fs.createWriteStream(`./musics/${id}${indexVideo}.mp3`)).on("finish", function() {
										let fileSize = getFileSize(`./musics/${id}${indexVideo}.mp3`);
										if (fileSize > 50) {
											sendMessage({
												text: `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>25MB)`,
												threadID
											});
											logST({
												text: `Không thể gửi: dung lượng file quá lớn (${id})`,
												icon: "exclamation-triangle",
												bg: "bg3"
											}, parent);
										} else {
											let text;
											let songInfo = getMusicInfo(id, tempMusicsInfo);
											let timeGet = (Date.now() - start) / 1000;

											if (!songInfo)
												text = `${id} (${timeGet}s)`;
											else
												text = `Bài hát: ${songInfo.title}${os.EOL}Tác giả: ${songInfo.artists_names}${os.EOL}Get nhạc trong ${timeGet}s`;

											api.sendMessage({
												body: text,
												attachment: fs.createReadStream(`./musics/${id}${indexVideo}.mp3`)
											}, threadID, err => {
												if (err) {
													sendMessage({
														text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
														threadID
													});
													logST({
														text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
														icon: "exclamation-triangle",
														bg: "bg3"
													}, parent);
												}
												// you can delete the music if you want
												fs.unlink(`./musics/${id}${indexVideo}.mp3`, err => {
													if (err)
														console.log(err);
												});
											});
											logST({
												text,
												icon: "music",
												bg: "bg1"
											}, parent);
										}
									});
								})
								.catch(() => {
									setTimeout(() => {
										sendMessage({
											text: `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`,
											threadID
										});
										logST({
											text: `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`,
											icon: "exclamation-triangle",
											bg: "bg3"
										}, parent);
									}, 500);
								});

							break;
						}

					}
					break;
				}

				case "data": {
					sendMessage({
						text: JSON.stringify(group),
						threadID
					});
				}

				// eslint-disable-next-line no-fallthrough
				case "p":
					// p mean pss..sst or pause :) that means bot will not reply
					break;

				case "game":
					sendMessage({
						text: `Game tictactoe :v  ${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`,
						threadID
					});
					group.gaming = true;
					group.game.tictactoe = new TicTacToe();
					break;

				default:
					sendMessage({
						text: "Command not found!",
						threadID
					});
					break;

			}
			// >>>> END OF COMMAND CONFIG <<<<

			if (callback)
				callback(); // commands
		};

		api.listenMqtt(async function(err, mssg) {

			if (!mssg || mssg.threadID == undefined)
				return;

			let {
				threadID,
				senderID,
				body,
				isGroup
			} = mssg;

			if (whiteListGroup.indexOf(threadID) != -1) return;

			if (threadID != MITSUKU_THREADID && body && isGroup) { // tin nhan tu group gui toi
				body = body.trim().replace(/shut/g, "");

				let group = groupManager.find(threadID, true, true);
				if (group.updating) // check if is updating . . .
					return;
				if (!group.live) // disable from dashboard
					return;

				let isCommand, syntaxError;

				if (body[0] == "/") { // check if command
					isCommand = true;
					let command, params = [];
					try {
						let words = body.split(" ");
						command = words[0].substring(1, words[0].length); // lay ten command
						words.splice(0, 1); // xoa phan command (vi du: /add  ,  /langage)
						for (let word of words) // loc nhung tu hop le ['', '', 'a'] thi param = ['a']
							if (word != "")
								params.push(word.replace(/_/g, " "));
					} catch (e) {
						command = "";
						syntaxError = e.message;
					} finally {
						ExecuteCommand(command, params, mssg, group);
						group.uploadToDtb();
						group.memberManager.find(senderID, true, true).uploadToDtb();
					}
				}

				if (syntaxError) { // neu sai cu phap thi terminate
					sendMessage({
						text: `Syntax Error: ${syntaxError}`,
						threadID
					});
					return;
				}

				if (isCommand) // If command, then terminate
					return;
				else { // not a command
					group.messagesCount++;
					group.memberManager.find(senderID, true, true).messagesCount++;
					group.uploadToDtb();
					group.memberManager.find(senderID, true, true).uploadToDtb();
				}
				if (group.gaming) {
					const validNumber = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];
					if (validNumber.indexOf(body) == -1)
						return;
					const game = group.game.tictactoe;
					const numbers = body.split("");
					game.add(numbers);
					const winner = game.isEnd();
					sendMessage({
						text: game.getData(),
						threadID
					});
					if (winner) {
						sendMessage({
							text: `${winner} đã chiến thắng :v`,
							threadID
						});
						group.gaming = false;
					}
				}

				if (!group.chat)
					return;

				let {
					data
				} = await axios.get(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${TRANS_KEY}&text=${encodeURI(body)}`);
				let {
					code,
					lang: userLanguage
				} = data;
				logST({
					text: `USER: '${body}' - detected (${userLanguage})`,
					icon: "reply",
					bg: "bg1"
				}, parent);
				if (code == 200) { // request thanh cong
					if (userLanguage == "en") { // neu la tieng anh thi khoi can dich (tiet kiem thoi gian)
						let text = body;
						queue.push(threadID); // khi nao api translate gui thanh cong thi moi xoa queue

						sendMessage({ // send message to mitsuku
							text,
							threadID: MITSUKU_THREADID
						});
					} else {
						axios.get(`https://translate.yandex.net/api/v1.5/tr/translate?key=${TRANS_KEY}&text=${encodeURI(body)}&lang=${userLanguage}-en`).then(({
							data
						} = {}) => {
							queue.push(threadID); // khi nao api translate gui thanh cong thi moi xoa queue
							jquery("body").html(data);
							let text = jquery("text").html();

							sendMessage({
								text,
								threadID: MITSUKU_THREADID
							});
							logST({
								text: `"${body}"" - translated to "${text}" (${userLanguage} --> en)`,
								icon: "exchange-alt",
								bg: "bg1"
							}, parent);
						});
					}
				}
			}

			if (mssg.threadID == MITSUKU_THREADID) { // neu la MITSUKU thi gui cho group
				let queryID = queue.splice(0, 1)[0];
				let group = groupManager.find(queryID, true, true);
				let {
					language: groupLanguage,
					emote
				} = group; // lay current language cua group
				let _emote = emote ? emotes[random.int(0, emotes.length - 1)] : "";

				if (groupLanguage == "en") {
					let text = body + _emote;

					sendMessage({
						text,
						threadID: queryID
					});
					logST({
						text: `MITSUKU: '${text}'`,
						icon: "robot",
						bg: "bg1"
					}, parent);
				} else {
					axios.get(`https://translate.yandex.net/api/v1.5/tr/translate?key=${TRANS_KEY}&text=${encodeURI(body)}&lang=en-${groupLanguage}`).then(({
						data
					} = {}) => {
						jquery("body").html(data);
						let text = jquery("text").html() + _emote;

						sendMessage({
							text,
							threadID: queryID
						});
						logST({
							text: `MITSUKU: '${body}' - translated to '${text}' (en --> ${groupLanguage})`,
							icon: "exchange-alt",
							bg: "bg1"
						}, parent);
					});
				}
			} // listen to message
		});
	});
=======
    login({
        appState: JSON.parse(appState)
    }, function(err, api) {

        let {
            groupManager,
            chatbot
        } = parent;
        let {
            logs,
            queue,
            tempMusicsInfo
        } = chatbot;

        if (err) return console.log(err);

        let sendMessage = function(data, callback) {
            api.sendMessage(data.text, data.threadID, callback);
        };

        // saving cac thu
        parent.appState = JSON.stringify(api.getAppState());
        chatbot.err = err;
        chatbot.api = api;
        // --

        let ExecuteCommand = async function(command, params, mssg, group, callback) {
            // >>>> COMMAND CONFIG <<<<
            let {
                threadID,
                senderID
            } = mssg;
            switch (command) {
                case "lang":
                    // If the language is unknown, the bot will not respond
                    // Check this out: http://www.lingoes.net/en/translator/langcode.htm
                    group.language = params[0].toLowerCase();

                    sendMessage({
                        text: `Language has changed to [${params[0]}]`,
                        threadID
                    });
                    logST({
                        text: `Đã chuyển sang ngôn ngữ ${params[0]} cho groupID: ${threadID}`,
                        icon: "language",
                        bg: "bg2"
                    }, parent);
                    break;

                case "chat":
                    if (["toggle", "on", "off"].indexOf(params[0]) == -1)
                        break;
                    if (params[0] == "toggle")
                        group.chat = !group.chat;
                    else
                        group.chat = STR_TO_KEYWORD[params[0]];
                    sendMessage({
                        text: `chat has changed to [${KEYWORD_TO_STR[group.chat]}]`,
                        threadID
                    });
                    logST({
                        text: `Đã chuyển chat chat sang ${KEYWORD_TO_STR[group.chat]} cho groupID: ${threadID}`,
                        icon: "robot",
                        bg: "bg2"
                    }, parent);
                    break;

                case "help":
                    sendMessage({
                        text: `Danh sách các câu lệnh hợp lệ: ${os.EOL}/lang [en/vi/zh/...]${os.EOL}/chat [on/off]${os.EOL}/emote [on/off]${os.EOL}/add [id]${os.EOL}/delete [id]${os.EOL}/mute [id] [second] [reason]${os.EOL}/weather setdefault [địa điểm]${os.EOL}/weather [địa điểm] (nếu không có địa điểm thì sẽ search theo default weather của group)${os.EOL}/music [search/play] [tên bài hát (ko dấu)/ ID của bài hát] search để tìm kiếm bài hát sau đó lấy id để xài lệnh /music play${os.EOL}/yt [id] là get nhạc theo id của youtube`,
                        threadID
                    });
                    break;

                case "emote":
                    if (["toggle", "on", "off"].indexOf(params[0]) == -1) {
                        break;
                    }
                    if (params[0] == "toggle")
                        group.emote = !group.emote;
                    else
                        group.emote = STR_TO_KEYWORD[params[0]];

                    sendMessage({
                        text: `Emote has changed to [${KEYWORD_TO_STR[group.emote]}]`,
                        threadID
                    });
                    logST({
                        text: `Đã chuyển emote sang status ${KEYWORD_TO_STR[group.emote]} cho groupID: ${threadID}`,
                        icon: "kiss-beam",
                        bg: "bg2"
                    }, parent);
                    break;

                case "add":
                    {
                        let userID = params[0];
                        api.addUserToGroup(userID, threadID);
                        logST({
                            text: `Đã add ${group.memberManager.find(userID, true).name}(${userID}) vào group ${threadID}`,
                            icon: "user-plus",
                            bg: "bg2"
                        }, parent);
                        break;
                    }

                case "delete":
                    {
                        let userID = params[0];
                        if (userID == "100052638460826" || userID == "100007723935647")
                            return;
                        api.removeUserFromGroup(userID, threadID);
                        logST({
                            text: `Đã xóa ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}`,
                            icon: "user-minus",
                            bg: "bg2"
                        }, parent);
                        break;
                    }

                case "mute":
                    {
                        let time = params[1];
                        if (time <= 0)
                            time = 1;
                        let userID = params[0];
                        let reason = params[2];
                        let tempFunc = () => {
                            ExecuteCommand("delete", [userID], mssg, group);
                            setTimeout(() => {
                                ExecuteCommand("add", [userID], mssg, group);
                            }, time * 1000);
                        };
                        if (reason) {
                            sendMessage({
                                text: `Bị khóa mõm vì lí do: ${reason}${os.EOL}Thời gian lãnh án: ${time} giây!`,
                                threadID
                            }, tempFunc);
                            logST({
                                text: `Đã mute user ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}, lí do: ${reason}`,
                                icon: "comment-slash",
                                bg: "bg2"
                            }, parent);
                        } else {
                            tempFunc();
                        }
                        break;
                    }

                case "count":
                    {
                        let id = params[0];
                        if (id == "group" || !id) {
                            sendMessage({
                                text: `Tổng số tin nhắn trong group: ${group.messagesCount}`,
                                threadID
                            });
                            logST({
                                text: `Tổng số tin nhắn trong group ${threadID}: ${group.messagesCount}`,
                                icon: "calculator",
                                bg: "bg1"
                            }, parent);
                        } else {
                            let userData = await group.getUserData(api, id);
                            let name = userData.name;
                            let messagesCount = group.memberManager.find(id, true).messagesCount;
                            sendMessage({
                                text: `Tổng số tin nhắn của ${name}: ${messagesCount}`,
                                threadID
                            });
                            logST({
                                text: `Tổng số tin nhắn của ${name}: ${messagesCount}`,
                                icon: "calculator",
                                bg: "bg1"
                            }, parent);
                        }
                        break;
                    }

                case "rank":
                    {
                        let id = params[0];
                        if (id == "all") {
                            group.sortRank("messagesCount", false);
                            let text = "";
                            let listMember = group.memberManager.items;
                            let length = listMember.length > 10 ? 10 : listMember.length;
                            for (let i = 0; i < length; i++) {
                                let name = (await group.getUserData(api, listMember[i].id)).name;
                                group.memberManager.find(senderID, true, true).name = name;
                                text = text + `Top ${i+1} là: ${name} (${group.memberManager.find(listMember[i].id, true, true).messagesCount}) ${os.EOL}`;
                            }

                            sendMessage({
                                text,
                                threadID
                            });
                            logST({
                                text,
                                icon: "sort-amount-up",
                                bg: "bg1"
                            }, parent);

                        } else {
                            let data = await group.checkRank(api, id);
                            sendMessage({
                                text: `Rank của ${data.name} trong group là ${data.rank}!`,
                                threadID
                            });
                            logST({
                                text: `Rank của ${data.name} trong group là ${data.rank}!`,
                                icon: "sort-amount-up",
                                bg: "bg1"
                            }, parent);
                        }
                        break;
                    }

                case "weather":
                    {
                        // list all cities in vietnam
                        // https://www.back4app.com/database/back4app/list-of-cities-in-vietnam/dataset-api

                        if (params[0] == "setdefault") {
                            group.location = params[1];
                            sendMessage({
                                text: `Đã set weather default là ${params[1]}`,
                                threadID
                            });
                            logST({
                                text: `Đã set weather default là ${params[1]}`,
                                icon: "check",
                                bg: "bg2"
                            }, parent);
                        } else {
                            let location;

                            if (!params[0])
                                location = group.location;
                            else {
                                location = params[0];
                            }

                            if (location)
                                axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&APPID=${WEATHER_KEY}`).then(response => {
                                    let {
                                        weather,
                                        main,
                                        name
                                    } = response.data;
                                    let text = `Name: ${name}${os.EOL}Weather: ${weather[0].main}(${weather[0].description})${os.EOL}Temperature: ${Math.round(main.temp_min-273)}°C ~ ${Math.round(main.temp_max-273)}°C`;
                                    sendMessage({
                                        text,
                                        threadID
                                    });
                                    logST({
                                        text,
                                        icon: "cloud-sun",
                                        bg: "bg1"
                                    }, parent);
                                })
                                .catch((e) => {
                                    sendMessage({
                                        text: `Không tìm thấy địa điểm nào có tên: ${location}`,
                                        threadID
                                    });
                                    logST({
                                        text: `Không tìm thấy địa điểm nào có tên: ${location}`,
                                        icon: "exclamation-triangle",
                                        bg: "bg3"
                                    }, parent);
                                });
                            else {
                                sendMessage({
                                    text: "Bạn chưa đặt weather default cho group, hãy xài lệnh: /weather setdefault [location]",
                                    threadID
                                });
                                logST({
                                    text: "Bạn chưa đặt weather default cho group, hãy xài lệnh: /weather setdefault [location]",
                                    icon: "exclamation-triangle",
                                    bg: "bg3"
                                }, parent);
                            }
                        }
                        break;
                    }

                case "yt":
                    {
                        let id = params[0].replace(/ /g, "_"); // convert nguoc lai, vi id youtube co the co _
                        let url = `http://api.kb2ateam.com/get-mp3?id=${id}`;
                        let start = Date.now();
                        sendMessage({
                            text: `Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
                            threadID
                        });
                        request(url, (error, response) => {
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
                                    if (fileSize > 50) {
                                        sendMessage({
                                            text: `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>50MB)`,
                                            threadID
                                        });
                                        logST({
                                            text: `Không thể gửi: dung lượng file quá lớn (${id})`,
                                            icon: "exclamation-triangle",
                                            bg: "bg3"
                                        }, parent);
                                    } else {
                                        let timeGet = (Date.now() - start) / 1000;
                                        let text = `Tiêu đề: ${name}${os.EOL}Thời lượng: ${duration}${os.EOL}Get nhạc trong ${timeGet}s`;
                                        api.sendMessage({
                                            body: text,
                                            attachment: fs.createReadStream(`./musics/${id}${indexVideo}.mp3`)
                                        }, threadID, err => {
                                            if (err) {
                                                sendMessage({
                                                    text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
                                                    threadID
                                                });
                                                logST({
                                                    text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
                                                    icon: "exclamation-triangle",
                                                    bg: "bg3"
                                                }, parent);
                                            }
                                            // you can delete the music if you want
                                            fs.unlink(`./musics/${id}${indexVideo}.mp3`, err => {
                                                if (err) throw err;
                                            });
                                        });
                                        logST({
                                            text,
                                            icon: "youtube",
                                            bg: "bg1"
                                        }, parent);
                                    }
                                });
                            } else {
                                sendMessage({
                                    text: `Có lỗi trong quá trình get video (${id})${os.eol}`,
                                    threadID
                                });
                                logST({
                                    text: `Có lỗi trong quá trình get video (${id})`,
                                    icon: "exclamation-triangle",
                                    bg: "bg3"
                                }, parent);
                            }
                        });
                        break;
                    }

                case "music":
                    {
                        let method = params[0];
                        switch (method) {
                            case "search":
                                {
                                    let song = params[1];
                                    axios.get(`https://zingmp3.vn/api/search/multi?q=${encodeURI(song)}&ctime=1593161576&sig=${MP3_SIG}&api_key=${MP3_KEY}`).then(response => {
                                        let songData = response.data.data.song;

                                        if (!songData.hasOwnProperty("total")) {
                                            sendMessage({
                                                text: `Không tìm thấy bài hát nào có tên: ${song}`,
                                                threadID
                                            });
                                            logST({
                                                text: `Không tìm thấy bài hát nào có tên: ${song}`,
                                                icon: "exclamation-triangle",
                                                bg: "bg3"
                                            }, parent);
                                            return;
                                        }
                                        let length = (songData.items.length > 10 ? 10 : songData.items.length);
                                        let text = `Kết quả tìm thấy: ${songData.items.length}${os.EOL}Danh sách id các bài hát:${os.EOL}`;
                                        for (let i = 0; i < length; i++) {
                                            let {
                                                id,
                                                title,
                                                artists_names
                                            } = songData.items[i];
                                            text = text + `${i+1}. Title: ${title}, artist: ${artists_names}, id: ${id}${os.EOL}`;
                                            addMusicInfo(songData.items[i], tempMusicsInfo);
                                        }
                                        sendMessage({
                                            text,
                                            threadID
                                        });
                                        logST({
                                            text,
                                            icon: "search",
                                            bg: "bg1"
                                        }, parent);
                                    })
                                    .catch(() => {
                                        sendMessage({
                                            text: `Có lỗi khi tìm kiếm (${song})`,
                                            threadID
                                        });
                                        logST({
                                            text: `Có lỗi khi tìm kiếm (${song})`,
                                            icon: "exclamation-triangle",
                                            bg: "bg3"
                                        }, parent);
                                    });

                                    break;
                                }
                            case "play":
                                {
                                    let start = Date.now();
                                    let id = params[1].toUpperCase();
                                    sendMessage({
                                        text: `Đang thu thập dữ liệu, vui lòng đợi . . . (${id})`,
                                        threadID
                                    });

                                    getDownloadUrl(id).then(url => {
                                        const indexVideo = uniqueIndexVideo++;
                                        request(url).pipe(fs.createWriteStream(`./musics/${id}${indexVideo}.mp3`)).on("finish", function() {
                                            let fileSize = getFileSize(`./musics/${id}${indexVideo}.mp3`);
                                            if (fileSize > 50) {
                                                sendMessage({
                                                    text: `Không thể gửi: dung lượng file id(${id}) quá lớn (${fileSize}MB>25MB)`,
                                                    threadID
                                                });
                                                logST({
                                                    text: `Không thể gửi: dung lượng file quá lớn (${id})`,
                                                    icon: "exclamation-triangle",
                                                    bg: "bg3"
                                                }, parent);
                                            } else {
                                                let text;
                                                let songInfo = getMusicInfo(id, tempMusicsInfo);
                                                let timeGet = (Date.now() - start) / 1000;

                                                if (!songInfo)
                                                    text = `${id} (${timeGet}s)`;
                                                else
                                                    text = `Bài hát: ${songInfo.title}${os.EOL}Tác giả: ${songInfo.artists_names}${os.EOL}Get nhạc trong ${timeGet}s`;

                                                api.sendMessage({
                                                    body: text,
                                                    attachment: fs.createReadStream(`./musics/${id}${indexVideo}.mp3`)
                                                }, threadID, err => {
                                                    if (err) {
                                                        sendMessage({
                                                            text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
                                                            threadID
                                                        });
                                                        logST({
                                                            text: `Đã gặp lỗi '${err.errorDescription}'' với id: ${id}`,
                                                            icon: "exclamation-triangle",
                                                            bg: "bg3"
                                                        }, parent);
                                                    }
                                                    // you can delete the music if you want
                                                    fs.unlink(`./musics/${id}${indexVideo}.mp3`, err => {
                                                        if (err)
                                                            console.log(err);
                                                    });
                                                });
                                                logST({
                                                    text,
                                                    icon: "music",
                                                    bg: "bg1"
                                                }, parent);
                                            }
                                        });
                                    })
                                    .catch(() => {
                                        setTimeout(() => {
                                            sendMessage({
                                                text: `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`,
                                                threadID
                                            });
                                            logST({
                                                text: `Đã gặp lỗi: Không tìm thấy id bài hát! (${id})`,
                                                icon: "exclamation-triangle",
                                                bg: "bg3"
                                            }, parent);
                                        }, 500);
                                    });

                                    break;
                                }

                        }
                        break;
                    }

                case "data":
                    {
                        sendMessage({
                            text: JSON.stringify(group),
                            threadID
                        });
                    }

                    // eslint-disable-next-line no-fallthrough
                case "p":
                    // p mean pss..sst or pause :) that means bot will not reply
                    break;

                case "game":
                    sendMessage({
                        text: `Game tictactoe :v  ${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`,
                        threadID
                    });
                    group.gaming = true;
                    group.game.tictactoe = new TicTacToe();
                    break;

                default:
                    sendMessage({
                        text: "Command not found!",
                        threadID
                    });
                    break;

            }
            // >>>> END OF COMMAND CONFIG <<<<

            if (callback)
                callback(); // commands
        };

        api.listenMqtt(async function(err, mssg) {

            if (!mssg || mssg.threadID == undefined)
                return;

            let {
                threadID,
                senderID,
                body,
                isGroup
            } = mssg;

            if (whiteListGroup.indexOf(threadID) != -1) return;

            if (threadID != MITSUKU_THREADID && body && isGroup) { // tin nhan tu group gui toi
                body = body.trim().replace(/shut/g, "");

                let group = groupManager.find(threadID, true, true);
                if (group.updating) // check if is updating . . .
                    return;
                if (!group.live) // disable from dashboard
                    return;

                let isCommand, syntaxError;

                if (body[0] == "/") { // check if command
                    isCommand = true;
                    let command, params = [];
                    try {
                        let words = body.split(" ");
                        command = words[0].substring(1, words[0].length); // lay ten command
                        words.splice(0, 1); // xoa phan command (vi du: /add  ,  /langage)
                        for (let word of words) // loc nhung tu hop le ['', '', 'a'] thi param = ['a']
                            if (word != "")
                                params.push(word.replace(/_/g, " "));
                    } catch (e) {
                        command = "";
                        syntaxError = e.message;
                    } finally {
                        ExecuteCommand(command, params, mssg, group);
                        // group.uploadToDtb();
                        // group.memberManager.find(senderID, true, true).uploadToDtb();
                    }
                }

                if (syntaxError) { // neu sai cu phap thi terminate
                    sendMessage({
                        text: `Syntax Error: ${syntaxError}`,
                        threadID
                    });
                    return;
                }

                if (isCommand) // If command, then terminate
                    return;
                else { // not a command
                    group.messagesCount++;
                    group.memberManager.find(senderID, true, true).messagesCount++;
                    // group.uploadToDtb();
                    // group.memberManager.find(senderID, true, true).uploadToDtb();
                }
                if (group.gaming) {
                    const validNumber = ['11', '12', '13', '21', '22', '23', '31', '32', '33'];
                    if (isNaN(body) || body.length > 2 || validNumber.indexOf(body) == -1)
                        return sendMessage({
                            text: "Vui lòng nhập số hợp lệ (đang chơi trò tictactoe mà)",
                            threadID
                        });
                    const game = group.game.tictactoe;
                    const numbers = body.split('');
                    game.add(numbers);
                    const winner = game.isEnd();
                    sendMessage({
                        text: game.getData(),
                        threadID
                    })
                    if (winner) {
                        sendMessage({
                            text: `${winner} đã chiến thắng :v`,
                            threadID
                        });
                        group.gaming = false;
                    }
                }

                if (!group.chat)
                    return;

                let {
                    data
                } = await axios.get(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${TRANS_KEY}&text=${encodeURI(body)}`);
                let {
                    code,
                    lang: userLanguage
                } = data;
                logST({
                    text: `USER: '${body}' - detected (${userLanguage})`,
                    icon: "reply",
                    bg: "bg1"
                }, parent);
                if (code == 200) { // request thanh cong
                    if (userLanguage == "en") { // neu la tieng anh thi khoi can dich (tiet kiem thoi gian)
                        let text = body;
                        queue.push(threadID); // khi nao api translate gui thanh cong thi moi xoa queue

                        sendMessage({ // send message to mitsuku
                            text,
                            threadID: MITSUKU_THREADID
                        });
                    } else {
                        axios.get(`https://translate.yandex.net/api/v1.5/tr/translate?key=${TRANS_KEY}&text=${encodeURI(body)}&lang=${userLanguage}-en`).then(({
                            data
                        } = {}) => {
                            queue.push(threadID); // khi nao api translate gui thanh cong thi moi xoa queue
                            jquery("body").html(data);
                            let text = jquery("text").html();

                            sendMessage({
                                text,
                                threadID: MITSUKU_THREADID
                            });
                            logST({
                                text: `"${body}"" - translated to "${text}" (${userLanguage} --> en)`,
                                icon: "exchange-alt",
                                bg: "bg1"
                            }, parent);
                        });
                    }
                }
            }

            if (mssg.threadID == MITSUKU_THREADID) { // neu la MITSUKU thi gui cho group
                let queryID = queue.splice(0, 1)[0];
                let group = groupManager.find(queryID, true, true);
                let {
                    language: groupLanguage,
                    emote
                } = group; // lay current language cua group
                let _emote = emote ? emotes[random.int(0, emotes.length - 1)] : "";

                if (groupLanguage == "en") {
                    let text = body + _emote;

                    sendMessage({
                        text,
                        threadID: queryID
                    });
                    logST({
                        text: `MITSUKU: '${text}'`,
                        icon: "robot",
                        bg: "bg1"
                    }, parent);
                } else {
                    axios.get(`https://translate.yandex.net/api/v1.5/tr/translate?key=${TRANS_KEY}&text=${encodeURI(body)}&lang=en-${groupLanguage}`).then(({
                        data
                    } = {}) => {
                        jquery("body").html(data);
                        let text = jquery("text").html() + _emote;

                        sendMessage({
                            text,
                            threadID: queryID
                        });
                        logST({
                            text: `MITSUKU: '${body}' - translated to '${text}' (en --> ${groupLanguage})`,
                            icon: "exchange-alt",
                            bg: "bg1"
                        }, parent);
                    });
                }
            } // listen to message
        });
    });
>>>>>>> 8c0baa7e98c424a98b4d36807642381eb3b57ff2
}

export {
    deployChatbot
};