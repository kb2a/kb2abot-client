import {
	exec
} from "child_process";
import fs from "fs";
import os from "os";
import Command from "./Command.js";
import {
	round
} from "../../helper/helperCommand.js";

class Version extends Command {
	constructor() {
		super({
			keywords: ["version", "v"]
		});
	}

	execute(args, api, parent, mssg, group) {
		super.execute(args, api, parent, mssg, group);
		const version = new Promise(resolve => {
			exec("git rev-list --count master", (err, stdout) => resolve(stdout.toString().trim()));
		});
		const commitMessage = new Promise(resolve => {
			resolve(fs.readFileSync(`${__dirname}/../../../.git/COMMIT_EDITMSG`).toString().trim());
		});
		Promise.all([version, commitMessage]).then(values => {
			api.sendMessage(`Version hiện tại của bot: ${round(values[0]/100, 1)}${os.EOL}Thông điệp từ dev: ${values[1]}`, mssg.threadID);
		});
		// const replyMsg = ;
	}
}

export default Version;
