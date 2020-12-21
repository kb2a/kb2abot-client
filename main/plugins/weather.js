const axios = require("axios");
const os = require("os");
const WEATHER_KEY = "9e41bc31443314a1c5ad9695f2e9f9d1";

module.exports = {
	type: "normal",
	friendlyName: "Dự báo thời tiết",
	keywords: ["weather", "wea"],
	description: "Cho thông tin về thời tiết hiện tại 1 địa chỉ nào đó",
	extendedDescription: "<location>",
	fn: async function(api, message) {
		const location = kb2abot.utils.getParam(message.body);
		try {
			const {weather, main, name} = (
				await await axios.get(
					`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
						location
					)}&APPID=${WEATHER_KEY}`
				)
			).data;
			const replyMsg = `Name: ${name}${os.EOL}Weather: ${weather[0].main}(${
				weather[0].description
			})${os.EOL}Temperature: ${Math.round(main.temp_min - 273)}°C ~ ${Math.round(
				main.temp_max - 273
			)}°C`;
			api.sendMessage(replyMsg, message.threadID);
		} catch (e) {
			const replyMsg = `Không tìm thấy địa điểm nào có tên: ${location}`;
			api.sendMessage(replyMsg, message.threadID);
		}
	}
};
