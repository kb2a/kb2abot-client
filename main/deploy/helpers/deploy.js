/**
 * Các function cần thiết dùng để khởi động kb2abot cho 1 tài khoản
 * @module DEPLOY
 */
const fs = require('fs');
const path = require('path');
const login = require('facebook-chat-api');

/**
 * Hàm tạo appState từ ATP cookie
 * @param  {String} atp ATP cookie (text)
 * @return {Object}     appState dùng để login fca
 */
const convertAtpToAppstate = atp => {
	const unofficialAppState = [];
	const items = atp.split(';|')[0].split(';');
	if (items.length < 2) throw 'Not a atp cookie';
	const validItems = ['sb', 'datr', 'c_user', 'xs'];
	let validCount = 0;
	for (const item of items) {
		const key = item.split('=')[0];
		const value = item.split('=')[1];
		if (validItems.includes(key)) validCount++;
		unofficialAppState.push({
			key,
			value,
			domain: 'facebook.com',
			path: '/'
		});
	}
	if (validCount >= validItems.length) {
		return unofficialAppState;
	} else {
		throw 'Not a atp cookie';
	}
};
/**
 * Kiểm tra loại cookie (j2team, atp, appstate)
 * @param  {String} text Văn bản cookie nào đó
 * @return {String}      "j2team" | "appstate" | "atp"
 */
const getCookieType = text => {
	let parseTest;
	try {
		parseTest = JSON.parse(text);
		if (parseTest.url && parseTest.cookies) {
			return 'j2team'; // cookie của ext j2team cookie
		} else {
			return 'appstate'; // cookie appstate của facebook-chat-api
		}
	} catch (e) {
		try {
			convertAtpToAppstate(text);
			return 'atp'; // cookie của ext atp cookie
		} catch (e) {
			return -1; // Tào lao
		}
	}
};
/**
 * Xóa hết tất cả file trong folder /musics
 */
const truncateMusics = () => {
	fs.readdir('musics', (err, files) => {
		// delete all music files before start
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join('musics', file), error => {
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
		login(credential, kb2abot.config.FCA_OPTIONS, (err, api) => {
			if (err) {
				return reject(new Error('Wrong/expired cookie!'));
			}
			const userID = api.getCurrentUserID();
			api.getUserInfo(userID, (err, ret) => {
				if (err) {
					return reject(
						new Error('Your account has been disabled or blocked features!')
					);
				}
				resolve({
					id: userID,
					name: ret[userID].name,
					appState: api.getAppState(),
					fca: api
				});
			});
		});
	});
};
/**
 * Hàm tạo appState từ j2team cookie
 * @param  {String} j2team J2TEAM cookie (text)
 * @return {Object}        appState dùng để login fca
 */
const convertJ2teamToAppstate = j2team => {
	const unofficialAppState = [];
	j2team = JSON.parse(j2team);
	for (const cookieElement of j2team.cookies) {
		unofficialAppState.push({
			key: cookieElement.name,
			value: cookieElement.value,
			expires: cookieElement.expirationDate || '',
			domain: cookieElement.domain.replace('.', ''),
			path: cookieElement.path
		});
	}
	return unofficialAppState;
};

module.exports = {
	getCookieType,
	truncateMusics,
	checkCredential,
	convertJ2teamToAppstate,
	convertAtpToAppstate
};
