/**
 * Các function cần thiết dùng để khởi động kb2abot cho 1 tài khoản
 * @module DEPLOY
 */
const fs = require("fs");
const path = require("path");
const login = require("facebook-chat-api");

/**
 * Kiểm tra xem đây có phải là dạng j2team cookie hay không
 * @param  {String} json Văn bản json nào đó
 * @return {Boolean}     True hoặc False
 */
const isJ2teamCookie = json => {
	if (json.url && json.cookies) {
		return true;
	}
	return false;
};
/**
 * Xóa hết tất cả file trong folder /musics
 */
const truncateMusics = () => {
	fs.readdir("musics", (err, files) => {
		// delete all music files before start
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join("musics", file), error => {
				if (error) throw error;
			});
		}
	});
};
/**
 * Kiểm tra thông tin tài khoản facebook
 * @param  {Object} credential Chứng chỉ (có thể là usr/pwd hoặc là appState)
 * @return {Promise}           Promise trả về id(uid), name(tên tk) và appState của tài khoản đó
 */
const checkCredential = credential => {
	return new Promise((resolve, reject) => {
		login(credential, {logLevel: "silent"}, (err, api) => {
			if (err) {
				console.log("Wrong/expired cookie!");
				reject(err);
				process.exit();
			}
			const userID = api.getCurrentUserID();
			api.getUserInfo(userID, (err, ret) => {
				if (err) process.exit();
				resolve({
					id: userID,
					name: ret[userID].name,
					appState: api.getAppState()
				});
			});
		});
	});
};
/**
 * Hàm tạo appState dựa vào j2team cookie
 * @param  {Object} j2teamCookie J2TEAM cookie
 * @return {Object}              appState dùng để login fca
 */
const generateAppState = j2teamCookie => {
	const unofficialAppState = [];
	for (const cookieElement of j2teamCookie.cookies) {
		unofficialAppState.push({
			key: cookieElement.name,
			value: cookieElement.value,
			expires: cookieElement.expirationDate || "",
			domain: cookieElement.domain.replace(".", ""),
			path: cookieElement.path
		});
	}
	return unofficialAppState;
};

module.exports = {
	isJ2teamCookie,
	truncateMusics,
	checkCredential,
	generateAppState
};
