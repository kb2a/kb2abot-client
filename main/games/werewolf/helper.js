const {execShellCommand} = kb2abot.helpers;
const {psendMessage} = kb2abot.helpers.fca;

const commandHandler = async (command, {game, api} = {}) => {
	let result;
	try {
		result = await execShellCommand(command);
		result = JSON.parse(result);
		for (const item of result.messages) {
			item.message = item.message.replace(/\\n/g, "\n");
			if (item.to)
				await psendMessage(api, [item.message, item.to]);
			else
				await psendMessage(api, [item.message, game.threadID]);
		}
	} catch {
		await psendMessage(api, [result, game.threadID]);
	}
};

module.exports = {
	commandHandler
};
