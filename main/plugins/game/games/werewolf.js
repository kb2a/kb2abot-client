const {psendMessage} = kb2abot.utils.FCA;
const {commandHandler} = kb2abot.utils.werewolf;
const {GameSchema} = kb2abot.schemas;

module.exports = class WerewolfGame extends GameSchema {
	constructor(options) {
		super(...options, ...{
			name: "werewolf"
		});
		this.is = {
			settingUp: true,
			playing: false
		};
	}

	async onMessage(api, message) {
		const game = this.storage.thread.global.game;
		if (message.body.toLowerCase() == "meplay" && game.is.settingUp) {
			game.participants = [1,2,3,4,5,6];
			game.participants.push(message.senderID);
			for (const threadID of game.participants) {
				const thread = this.account.find({id: threadID});
				if (thread) {
					thread.storage.game = new Game[gameName]({ // recode game manager
						masterID: message.senderID,
						threadID: message.threadID,
						msgParam: getParam(message.body)
					});
				}
			}
			if (game.participants.length >= 7) {
				game.is.playing = true;
				game.is.settingUp = false;
				const setup = `werewolf2 start ${game.participants.join(" ")} --caller caller${game.masterID} --tag ${game.threadID}`;
				await commandHandler(setup, {game, api});
				// await execShellCommand(`werewolf2 end --caller caller${game.masterID} --tag ${game.threadID}`);
			}
		}

		if (game.is.playing) {
			const command = `werewolf2 ${message.body} --caller ${message.senderID} --tag ${game.threadID}`;
			await commandHandler(command, {game, api});
		}
	}
};

//
// 	onCall: async function(api, message) {
// 		let game = getGame(this.storage.thread.global);
// 		if (!game) {
// 			newGame(this.storage.thread.global, {
// 				masterID: message.senderID,
// 				threadID: message.threadID
// 			});
// 			await psendMessage(api, ["Đã khởi tạo game werewolf thành công!", message.threadID]);
// 		}
// 	}
// };
