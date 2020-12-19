const {exec} = require("child_process");
const os = require("os");
const {round} = kb2abot.utils;

module.exports = {
	type: "normal",
	friendlyName: "Xem version, log update",
	keywords: ["version", "v"],
	description: "Tra cứu phiên bản của chatbot và xem update log",
	extendedDescription: "/version",
	fn: async function(api, message) {
		const commitCount = new Promise(resolve => {
			exec("git rev-list --count master", (err, stdout) =>
				resolve(stdout.toString().trim())
			);
		});
		const getAllCommits = new Promise(resolve => {
			exec("git log -5 --pretty=%B", (err, stdout) => {
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
