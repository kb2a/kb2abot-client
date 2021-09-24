const readline = require('readline');

const showStatus = require('./showStatus');

module.exports = {
	des: 'Cai dat cli',
	fn: async () => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		const readInput = () => {
			rl.question('', function(data) {
				switch (data) {
				case 'status':
					showStatus();
					break;
				case 'cls':
					console.clear();
					break;
				}
				readInput();
			});
		};
		readInput();
	}
};
