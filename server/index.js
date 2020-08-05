import path from "path";
import fs from "fs";
import login from "facebook-chat-api";
import uniqid from "uniqid";
import {
	AccountManager,
	Account,
} from "./roles";
import {
	generateAppState,
} from "./helper/helper.js";

const creDir = path.join(__dirname, "/../credentials/");
const fbDir = path.join(creDir, "facebook.json");
const meDir = path.join(creDir, "messenger.json");
const accDir = path.join(creDir, "credential.json");
const kb2abotDir = path.join(creDir, "kb2abotcookie.json");

// fs.readdir("musics", (err, files) => { // delete all music files before start
// 	if (err) throw err;
//
// 	for (const file of files) {
// 		fs.unlink(path.join("musics", file), (error) => {
// 			if (error) throw error;
// 		});
// 	}
// });

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
		const cookies = [];

		if (fs.existsSync(kb2abotDir)) {
			return resolve({
				kb2abot: JSON.parse(fs.readFileSync(kb2abotDir, "utf-8"))
			});
		}

		if (fs.existsSync(fbDir)) {
			cookies.push(JSON.parse(fs.readFileSync(fbDir, "utf-8")).cookies);
		} else {
			console.log("Ban thieu file facebook.json");
		}

		if (fs.existsSync(meDir)) {
			cookies.push(JSON.parse(fs.readFileSync(meDir, "utf-8")).cookies);
		} else {
			console.log("Ban thieu file messenger.json");
		}

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
	});
}

const accountManager = new AccountManager();
(async function() {
	let credential = {};

	console.log("Dang kiem tra . . .");
	console.log("Tip 1: Xai J2TEAM Cookie de lay cookie cua 2 trang tren thì chatbot cua minh moi dich duoc!");
	console.log("Tip 2: Neu login thanh cong roi thi ban khong can phai refresh 2 cai cookie nua, da co kb2abotcookie.json roi :)))");

	await checkFMJson().then(cookies => {
		if (!cookies.kb2abot)
			credential.appState = generateAppState(cookies.facebook, cookies.messenger);
		else
			credential.appState = cookies.kb2abot;
	}).catch(() => {
		if (fs.existsSync(accDir)) {
			parseJSON(fs.readFileSync(accDir, "utf8")).then(json => {
				Object.assign(credential, json);
			}).catch((err) => {
				console.log(err);
				console.log("Vui long kiem tra lai file credential.json, loi: khong the doc json!");
				process.exit(1);
			});
		} else {
			console.log("Ban thieu file credential.json");
			process.exit(1);
		}
	});

	checkCredential(credential).then((appState) => {
		fs.unlink(fbDir, () => {
			console.log("Da xoa file cookie facebook");
		});
		fs.unlink(meDir, () => {
			console.log("Da xoa file cookie messenger");
		});
		fs.writeFileSync(kb2abotDir, appState);
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
})();
