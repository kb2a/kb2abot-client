import os from "os";
import axios from "axios";
import {
	log
} from "../../../helper/helper.js";

// const MITSUKU_THREADID = "47719737069";
// const TRANS_KEY = "trnsl.1.1.20200421T120324Z.a5209d29ad08ae85.7328dad8e46f00dad4a4cdb9a911868d8ace112b"; // you can use your own yandex translate API KEY
// const emotes = ":3 🙂 😀 😞 😢 😛 😇 😈 o.O 😉 😮 😑  😠 😗 ❤ 😊 😎 😠 ♒ 😕 ♊ ☺ 󰀀 💩 ☀ ☁ ☔ ⚡ ✨ ⭐ ✳ ⛄ ☕ ♨ ⛵ ⛽ ✈ ⛲ ⛺ ⛪ ☎ ✉ ✂ 🚽 🛀 👙 👙 👕 👘 👗 👢 👠 👡 💼 👜 👔 🎩 👒 👑 💍 🚭 ⚽   ⚾ ⚾ ⛳ 🏈 🏀 🎾 🎱 🎯 🎿 🎌 🏁 🏆".split(" ");

function Mitsuku(body, api, parent, mssg) {
	log({
		text: `USER: "${body}"`,
		icon: "reply",
		bg: "bg1"
	}, parent);
	axios({
		"url": "https://kakko.pandorabots.com/pandora/talk-xml",
		"data": `input=${encodeURI(body)}&botid=9fa364f2fe345a10&custid=${mssg.threadID}`,
		"method": "POST",
		"mode": "no-cors"
	}).then(res => {
		const regexString = /<that>(.*?)<\/that>/.exec(res.data);
		const responseChat = regexString ? regexString[1] : "...";
		const replyMsg = responseChat.replace(/&quot;/g, os.EOL);
		api.sendMessage(replyMsg, mssg.threadID);
		log({
			text: `MITSUKU: "${replyMsg}"`,
			icon: "robot",
			bg: "bg1"
		}, parent);
	});
}

export default Mitsuku;
