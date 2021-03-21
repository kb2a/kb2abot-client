const sendMessage = (api, ...params) => {
	return new Promise(resolve => {
		api.sendMessage(...params, resolve);
	});
};
const getThreadInfo = (api, threadID) => {
	return new Promise(resolve => {
		api.getThreadInfo(threadID, (err, info) => {
			if (err) {
				console.error(err);
				resolve({});
			}
			else resolve(info);
		});
	});
};
const getUserInfo = (api, ids) => {
	return new Promise(resolve => {
		api.getUserInfo(ids, (err, obj) => {
			if (err) {
				console.error(err);
				resolve({});
			} else
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
const getThreadList = (api, limit, timestamp, tags) => {
	return new Promise(resolve => {
		api.getThreadList(limit, timestamp, tags, (err, list) => {
			if (err) {
				console.error(err);
				resolve([]);
			} else
				resolve(list);
		});
	});
};
const deleteThread = (api, threadID) => {
	return new Promise(resolve => {
		api.deleteThread(threadID, resolve);
	});
};
module.exports = {
	sendMessage,
	getThreadInfo,
	getUserInfo,
	getUsername,
	getThreadList,
	deleteThread
};
