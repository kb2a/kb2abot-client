import path from "path";
import fs from "fs";
import login from "facebook-chat-api";
import uniqid from "uniqid";
import {
	AccountManager,
	Account,
} from "./chatbot/roles.js";
import {
	generateAppState,
} from "./chatbot/utils.js";

fs.readdir("musics", (err, files) => { // delete all music files before start
	if (err) throw err;

	for (const file of files) {
		fs.unlink(path.join("musics", file), (error) => {
			if (error) throw error;
		});
	}
});

function checkCredential(credential) {
	return new Promise((resolve, reject) => {
		login(credential, (err, api) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.stringify(api.getAppState()));
			}
		});
	});
}

function parseJSON(text) {
	return new Promise((resolve, reject) => {
		let out;
		try {
			out = JSON.parse(text);
		} catch (err) {
			reject();
		} finally {
			resolve(out);
		}
	});
}

function checkFMJson() {
	return new Promise((resolve, reject) => {
		let cookies = [];
		const fbDir = path.join(__dirname, "/../credentials/facebook.json");
		const meDir = path.join(__dirname, "/../credentials/messenger.json");

		try {
			cookies.push(JSON.parse(fs.readFileSync(fbDir, "utf-8")).cookies);
			cookies.push(JSON.parse(fs.readFileSync(meDir, "utf-8")).cookies);
		} catch (e) {
			reject();
		} finally {
			if (cookies.length === 2) {
				resolve({
					facebook: cookies[0],
					messenger: cookies[1]
				});
			} else {
				console.log("Ban thieu/sai cu phap file facebook.json hoac messenger.json nen ko the tiep tuc login = cookie");
				console.log("Chuyen sang login = email/passwrd . . .");
				reject();
			}
		}
	})
}

const accountManager = new AccountManager();
(async function() {
	let credential = {};

	console.log("Dang kiem tra file facebook.json va messenger.json . . .");
	console.log("Tip: Xai J2TEAM Cookie de lay cookie cua 2 trang tren thì chatbot cua minh moi dich duoc!");

	await checkFMJson().then(cookies => {
		credential.appState = generateAppState(cookies.facebook, cookies.messenger);
	}).catch(() => {
		try {
			parseJSON(fs.readFileSync(`${__dirname}/../credentials/credential.json`, "utf8")).then(json => {
				Object.assign(credential, json);
			}).catch((err) => {
				console.log("Vui long kiem tra lai file account.json, loi: khong the doc json!");
				process.exit(1);
			});
		} catch (er) {
			console.log("Ban thieu file credential.json")
			process.exit(1);
		}
	});

	if (credential) {
		checkCredential(credential).then((appState) => {
			const uid = uniqid();
			const account = accountManager.add(new Account({
				username: credential.email || `username${uid}`,
				secretKey: "secret",
				appState,
			}));
			account.deploy();
		}).catch((err) => {
			console.log("Lỗi khi deploy chatbot!");
			console.log(err);
		});
	}
})();

export {
	accountManager,
};
