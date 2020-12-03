const request = require("request");

const getDownloadUrl = async id => {
	return new Promise((resolve, reject) => {
		request.get(
			`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`,
			(err, res, body) => {
				if (err || !body) {
					reject();
				} else {
					resolve(res.request.uri.href);
				}
			}
		);
	});
};

const addMusicInfo = (data, store) => {
	const {id} = data;
	let index = store.findIndex(e => e.id == id);
	if (index == -1) {
		store.push(data);
	} else {
		Object.assign(store[index], data);
	}
};

const getMusicInfo = (id, store) => {
	const index = store.findIndex(e => e.id == id);
	if (index != -1) return store[index];
	else return null;
};

module.exports = {
	getDownloadUrl,
	addMusicInfo,
	getMusicInfo
};
