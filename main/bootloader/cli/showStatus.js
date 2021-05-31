const isRunning = require('is-running');

module.exports = () => {
	const lives = [],
		dies = [];
	for (const bot of kb2abot.workers) {
		if (isRunning(bot.pid)) {
			lives.push(bot);
		} else {
			dies.push(bot);
		}
	}
	let logMessage = '';
	for (const live of lives) {
		logMessage += `${live.pid} ${live.name} >> live\n`;
	}
	for (const die of dies) {
		logMessage += `| ${die.pid} ${die.name} >> die\n`;
	}
	console.log(logMessage);
};
