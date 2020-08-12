import {
	exec
} from "child_process";
import os from "os";
import Command from "./Command.js";
import {
	round,
	isNoParam
} from "../../helper/helperCommand.js";

class Version extends Command {
	constructor() {
		super({
			keywords: ["version", "v"],
			help: "",
			description: "Tra cứu phiên bản của chatbot và xem update log"
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		if (!isNoParam(args))
			return;
		const commitCount = new Promise(resolve => {
			exec("git rev-list --count master", (err, stdout) => resolve(stdout.toString().trim()));
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
			let replyMsg = `Version hiện tại của bot: ${round(values[0]/100, 2)}${os.EOL}Lịch sử phiên bản:${os.EOL}`;
			for (let i = 0; i < values[1].length; i++) {
				const commitMessage = values[1][i];
				replyMsg += `Ver ${round((values[0]-i)/100, 2)}: ${commitMessage}${os.EOL}`;
			}

			api.sendMessage(replyMsg, mssg.threadID);
		});
		// const replyMsg = ;
	}
}

export default Version;
