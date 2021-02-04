const psendMessage = (api, params) => {
	return new Promise(resolve => {
		api.sendMessage(...params, err => {
			if (err) console.error(err);
			resolve();
		});
	});
};
module.exports = {
	psendMessage
};
