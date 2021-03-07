const sendMessage = (api, ...params) => {
	return new Promise(resolve => {
		api.sendMessage(...params, err => {
			if (err) console.error(err);
			resolve();
		});
	});
};
const getThreadInfo = (api, threadID) => {
	return new Promise(resolve => {
		api.getThreadInfo(threadID, (err, info) => {
			if (err) console.error(err);
			resolve(info);
		});
	});
};
const getUserInfo = (api, ids) => {
	return new Promise(resolve => {
		api.getUserInfo(ids, (err, obj) => {
			if (err) console.error(err);
			resolve(obj);
		});
	});
};
const getUsername = fblink => {
	try {
		return /id=(.*?)$/.exec(fblink)[1];
	}
	catch {
		return /.com\/(.*?)$/.exec(fblink)[1];
	}
};
module.exports = {
	sendMessage,
	getThreadInfo,
	getUserInfo,
	getUsername
};
