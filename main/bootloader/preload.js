const helpers = require("../helpers");

module.exports = {
	des: "Kiem tra plugins va utils",
	fn: async () => {
		const timeStart = Date.now();
		console.log();
		kb2abot.utils = await helpers.loader("utils", false);
		kb2abot.plugins = await helpers.loader("plugins", false);
		const latency = Date.now() - timeStart;
		console.log(
			"\n" +
			"██  ███ █  █ ███\n" +
			"█ █ █ █ ██ █ █_\n" +
			`█ █ █ █ █ ██ █    ${latency}ms!\n` +
			"██  ███ █  █ ███\n"
		);
	}
};
