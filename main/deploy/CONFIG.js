const path = require('path');

module.exports = {
	DEFAULT_THREAD_PREFIX: '/', // prefix mặc định cho mỗi box mới
	DIR: {
		GAME: path.join(__dirname, 'games'),
		PLUGIN: path.join(__dirname, 'plugins'),
		DATSTORE: path.join(__dirname, 'datastores'),
		SCHEMA: path.join(__dirname, 'schemas'),
		HELPER: path.join(__dirname, 'helpers'),
		UPDATE: path.join(__dirname, 'updates')
	},
	INTERVAL: {
		SAVE_DATASTORE: 5000,
		CHECK_UPDATE: 5 * 60000,
		AUTO_ACCEPT_REQUEST: 10000
	},
	PRETTY_DATASTORE: false, // enable may cause to its performance (adding tab characters to datastore)
	SUPER_ADMINS: [
		// 'super admin' có permission hơn cả admin, thường là những người điều khiển bot
		// Những người này có quyền được sử dụng 1 số lệnh nguy hiểm (như reload, update, ...)
		// Bạn có thể lên trang: findidfb.com hoặc lookup-id.com để lấy ID Facebook
		'100007723935647'
	],
	REFRESH_ADMINIDS: false
	// Bật cái này để làm mới lại list admin mỗi khi tin nhắn đến (còn không thì phải restart bot thì nó mới làm mới lại list)
	// Những bạn nào có acc khỏe hoặc số lượng box hoạt động nhỏ (<10) thì mới nên bật
};
