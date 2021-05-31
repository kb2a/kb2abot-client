const axios = require('axios');
const WEATHER_KEY = '9e41bc31443314a1c5ad9695f2e9f9d1';

module.exports = {
	keywords: ['weather'],

	name: 'Thời tiết hiện tại',

	description: 'Cho thông tin về thời tiết hiện tại 1 theo địa chỉ',

	guide: '<location>',

	childs: [],

	permission: {
		'*': '*'
	},

	datastoreDesign: {
		account: {
			global: {},
			local: {}
		},
		thread: {
			global: {},
			local: {}
		}
	},

	async onLoad() {},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		const location = kb2abot.helpers.getParam(message.body);
		if (!location) return reply('Vui lòng nhập địa chỉ!');
		try {
			const {weather, main, name} = (
				await axios.get(
					`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
						location
					)}&APPID=${WEATHER_KEY}`
				)
			).data;
			const replyMsg = `Name: ${name}\nWeather: ${weather[0].main}(${
				weather[0].description
			})\nTemperature: ${Math.round(main.temp_min - 273)}°C ~ ${Math.round(
				main.temp_max - 273
			)}°C`;
			reply(replyMsg);
		} catch (e) {
			const replyMsg = `Không tìm thấy địa điểm nào có tên: ${location}`;
			reply(replyMsg);
		}
	}
};
