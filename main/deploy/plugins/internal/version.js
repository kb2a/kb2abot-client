const {exec} = require('child_process');
const {round, getParam} = kb2abot.helpers;

module.exports = {
	keywords: ['version'],

	name: 'Kiểm tra phiên bản',

	description: 'Tra cứu lịch sử phiên bản của kb2abot',

	guide: '[<amount>]',

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
		let amount = parseInt(getParam(message.body));
		if (isNaN(amount) || amount <= 0) amount = 5;
		if (amount > 50) amount = 50;
		const commitamount = new Promise(resolve => {
			exec('git rev-list --count origin/main', (err, stdout) =>
				resolve(stdout.toString().trim())
			);
		});
		const getAllCommits = new Promise(resolve => {
			exec(`git log -${amount} --pretty=%B`, (err, stdout) => {
				const out = stdout.toString().trim();
				const tmp = encodeURI(out).split('%0A%0A');
				const final = [];
				for (const commit of tmp) {
					final.push(decodeURI(commit));
				}
				resolve(final);
			});
		});
		Promise.all([commitamount, getAllCommits]).then(values => {
			const versionNow = round(values[0] / 100, 2);
			let replyMsg = `Version hiện tại của bot: ${versionNow}\nLịch sử phiên bản:\n`;
			for (let i = 0; i < values[1].length; i++) {
				const version = round((values[0] - i) / 100, 2);
				const commitMessage = values[1][i];
				replyMsg += `Ver ${version}: ${commitMessage}\n`;
			}
			reply(replyMsg);
		});
	}
};
