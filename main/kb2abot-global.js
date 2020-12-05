const form = {
	id: 0, // id của người dùng facebook
	utils: {}, // các ultilities trong ./utils
	plugins: {}, // các plugins trong ./plugins
	helpers: {}, // các helpers trong ./helpers
	datastore: {}, // datastore (sử dụng nedb)
	pluginStorage: {} // lưu trữ các data của plugin (ví dụ engineName của plugin autoReply)
};

const apply = data => {
	return Object.assign(form, data);
};

module.exports = {
	form,
	apply
};
