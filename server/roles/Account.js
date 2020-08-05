import vigenere from "vigenere";
import mongoPoolPromise from "../helper/helperMongo.js";
import GroupManager from "./GroupManager.js";
import deployChatbot from "../deploychatbot";

class Account {
	constructor({
		dateCreated = Date.now(),
		username,
		secretKey,
		appState,
		encrypted = false
	} = {}) {
		this.dateCreated = dateCreated;
		this.username = username;
		this.secretKey = secretKey;
		this.encrypted = encrypted;
		this.appState = appState;

		this.chatbot = {
			logs: [],
			queue: [],
			tempMusicsInfo: []
		};

		this.encrypt();
		this.groupManager = new GroupManager({
			owner: this.username
		});
		// this.groupManager.downloadFromDtb().then(() => {});
	}

	deploy() {
		this.decrypt();
		deployChatbot(this.appState, this);
	}

	logout() {
		if (this.chatbot.api) {
			this.chatbot.api.logout();
		}
	}

	encrypt() {
		if (this.encrypted) {
			return;
		}
		this.username = vigenere.encode(this.username, this.secretKey);
		this.appState = vigenere.encode(this.appState, this.secretKey);
		this.encrypted = true;
	}

	decrypt() {
		if (!this.encrypted) {
			return;
		}
		this.username = vigenere.decode(this.username, this.secretKey);
		this.appState = vigenere.decode(this.appState, this.secretKey);
		this.encrypted = false;
	}

	async uploadToDtb() {
		this.encrypt();

		const dtb = await mongoPoolPromise();
		dtb.collection("account").updateOne({
			username: this.username
		}, {
			$set: {
				username: this.username,
				appState: this.appState,
				secretKey: this.secretKey,
				dateCreated: this.dateCreated
			}
		}, {
			upsert: true
		});
	}

	getData() {
		this.encrypt();
		return new Promise(async (resolve, reject) => {
			const dtb = await mongoPoolPromise();
			dtb.collection("account").find({
				username: this.username
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length == 1) {
					resolve(data[0]);
				} else {
					reject();
				}
			});
		});
	}
}

export default Account;
