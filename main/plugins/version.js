const {exec} = require("child_process");
const os = require("os");
const {round, getParam} = kb2abot.utils;

module.exports = {
	author: "KhoaKoMlem",
	type: "normal",
	friendlyName: "Xem version, log update",
	keywords: ["version", "v"],
	description: "Tra cứu phiên bản của chatbot và xem update log",
	extendedDescription: "<count>",
	fn: async function(api, message) {
		let count = parseInt(getParam(message.body));
		if (isNaN(count) || count <= 0) count = 5;
		if (count > 50) count = 50;
		const commitCount = new Promise(resolve => {
			exec("git rev-list --count origin/main", (err, stdout) =>
				resolve(stdout.toString().trim())
			);
		});
		const getAllCommits = new Promise(resolve => {
			exec(`git log -${count} --pretty=%B`, (err, stdout) => {
				const out = stdout.toString().trim();
				const tmp = encodeURI(out).split("%0A%0A");
				const final = [];
				for (const commit of tmp) {
					final.push(decodeURI(commit));
				}
				resolve(final);
			});
		});
		Promise.all([commitCount, getAllCommits]).then(values => {
			const versionNow = round(values[0] / 100, 2);
			let replyMsg = `Version hiện tại của bot: ${versionNow}${os.EOL}Lịch sử phiên bản:${os.EOL}`;
			for (let i = 0; i < values[1].length; i++) {
				const version = round((values[0] - i) / 100, 2);
				const commitMessage = values[1][i];
				replyMsg += `Ver ${version}: ${commitMessage}${os.EOL}`;
			}
			api.sendMessage(replyMsg, message.threadID);
		});
	}
};
