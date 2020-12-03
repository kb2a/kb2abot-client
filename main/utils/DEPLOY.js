const fs = require("fs");
const path = require("path");
const login = require("facebook-chat-api");

const isJ2teamCookie = json => {
	if (json.url && json.cookies) {
		return true;
	}
	return false;
};

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
