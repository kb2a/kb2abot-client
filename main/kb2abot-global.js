const form = {
	id: 0,				// id của người dùng facebook
	utils: {},			// ultilities
	plugins: {}, 		// các plugins trong ./plugins
	helpers: {}, 		// các helpers trong ./helpers
	datastore: {},		// datastore (sử dụng nedb)
	groupManager: {}, 	// quản lí các role Group
};

const apply = data => {
	return Object.assign(form, data);
}

module.exports = {
	form,
	apply,
};