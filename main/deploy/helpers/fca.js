const axios = require('axios');

const getUsername = fblink => {
	try {
		return /id=(.*?)$/.exec(fblink)[1];
	} catch {
		return /.com\/(.*?)$/.exec(fblink)[1];
	}
};
const sendMessage = (...params) => {
	return new Promise(resolve => {
		fca.sendMessage(...params, resolve);
	});
};
const getThreadInfo = threadID => {
	return new Promise((resolve, reject) => {
		fca.getThreadInfo(threadID, (err, info) => {
			if (err) reject(err);
			else resolve(info);
		});
	});
};
const getUserInfo = ids => {
	return new Promise((resolve, reject) => {
		fca.getUserInfo(ids, (err, obj) => {
			if (err) reject(err);
			else resolve(obj);
		});
	});
};
const getThreadList = (limit, timestamp, tags) => {
	return new Promise(resolve => {
		fca.getThreadList(limit, timestamp, tags, (err, list) => {
			if (err) resolve([]);
			else resolve(list);
		});
	});
};
const deleteThread = threadID => {
	return new Promise(resolve => {
		fca.deleteThread(threadID, resolve);
	});
};
const getToken = async () => {
	let stringifyCookie = '';
	const appstate = fca.getAppState();
	for (const e of appstate) {
		stringifyCookie += e.toString().split(';')[0] + ';';
	}
	const {data} = await axios.get(
		'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed',
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Referer: 'https://m.facebook.com/',
				Host: 'm.facebook.com',
				Origin: 'https://www.facebook.com',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
				Connection: 'keep-alive',
				cookie: stringifyCookie
			}
		}
	);
	return /(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(data)[1];
};
module.exports = {
	getUsername,
	sendMessage,
	getThreadInfo,
	getUserInfo,
	getThreadList,
	deleteThread,
	getToken
};
