const path = require("path");
const fs = require("fs");
const login = require("facebook-chat-api");
const uniqid = require("uniqid");
const {Account} = require("./roles");
// const {generateAppState} = require("./helper/helper.js");
const GroupManager = require("./roles/GroupManager.js");
const deployKb2abot = require("./deployKb2abot");

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
					appState: JSON.stringify(api.getAppState())
				});
			});
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

const generateAppState = function(j2teamCookie) {
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

const isJ2teamCookie = json => {
	if (json.url && json.cookies) {
		return true;
	}
	return false;
};

const minimist = require("minimist");
const parseArg = (str, specialChar) => {
	const quotes = ['"', "'", "`"];
	for (let quote of quotes) {
		let tmp = str.split(quote);
		for (let i = 1; i < tmp.length; i += 2) {
			str = str.replace(
				`${quote}${tmp[i]}`,
				`${tmp[i].replace(/ /g, specialChar)}`
			);
			str = str.replace(quote, "");
		}
	}
	const output = [];
	str.split(" ").forEach(word => {
		output.push(word.replace(new RegExp(specialChar, "g"), " "));
	});
	return minimist(output);
};
const args = parseArg("kb2abot " + process.argv.slice(2).join(""), "א");
(async () => {
	const parsedJSON = await parseJSON(fs.readFileSync(args.bot));
	const unofficialAppState = isJ2teamCookie(parsedJSON)
		? generateAppState(parsedJSON)
		: parsedJSON;
	const {id, name, appState: officialAppState} = await checkCredential({
		appState: unofficialAppState
	});
	fs.writeFileSync(args.bot, officialAppState);
	deployKb2abot(
		officialAppState,
		new Account({
			botName: /bots\\(.*).json$/.exec(args.bot)[1],
			username: name,
			secretKey: "secret",
			appState: officialAppState
		})
	);
	console.log(`kb2abot has started for username ${name} (${id})!`);
})();
