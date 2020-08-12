import axios from "axios";
import os from "os";
import {
	log
} from "../../helper/helper.js";
import {
	parseValue,
	isNoParam
} from "../../helper/helperCommand.js";
import Command from "./Command.js";

class Weather extends Command {
	constructor() {
		super({
			keywords: ["weather", "wea", "w"],
			help: "[--set=<locationName> | -s <locationName>] [--location=<locationName> | -l <locationName>]",
			description: "Cho thông tin về thời tiết hiện tại 1 địa chỉ nào đó"
		});
		this.WEATHER_KEY = "9e41bc31443314a1c5ad9695f2e9f9d1";
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const setDefault = parseValue(args, ["set", "s"]);
		let location = parseValue(args, ["location", "loc", "l"]);

		// list all cities in vietnam
		// https://www.back4app.com/database/back4app/list-of-cities-in-vietnam/dataset-

		if (setDefault) {
			group.location = setDefault;
			const replyMsg = `Đã set location cho group là ${group.location}`;
			api.sendMessage(replyMsg, mssg.threadID);
			log({
				text: replyMsg,
				icon: "check",
				bg: "bg2"
			}, parent);
		}

		if (isNoParam(args)) {
			if (!location) {
				if (!group.location) {
					const replyMsg = "Bạn chưa đặt vị trí mặc định cho group, hãy xài lệnh: /weather --set \"[location]\"";
					api.sendMessage(replyMsg, mssg.threadID);
					log({
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
				log({
					text: replyMsg,
					icon: "cloud-sun",
					bg: "bg1"
				}, parent);
			}).catch((e) => {
				console.log(e);
				const replyMsg = `Không tìm thấy địa điểm nào có tên: ${location}`;
				api.sendMessage(replyMsg, mssg.threadID);
				log({
					text: replyMsg,
					icon: "exclamation-triangle",
					bg: "bg3"
				}, parent);
			});
		}
	}
}

export default Weather;
