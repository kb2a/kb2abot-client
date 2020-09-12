const asyncWait = async function(time) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};

export {
	asyncWait
};
