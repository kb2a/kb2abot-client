const checkInternetConnected = require('check-internet-connected');

module.exports = {
	des: 'Kiem tra ket noi internet',
	fn: async () => {
		const config = {
			timeout: 5000, //timeout connecting to each server, each try
			retries: 5, //number of retries to do before failing
			domain: 'https://google.com' //the domain to check DNS record of
		};
		try {
			await checkInternetConnected(config);
		} catch (e) {
			throw `Vui long kiem tra lai ket noi internet! (${e.message})`;
		}
	}
};
