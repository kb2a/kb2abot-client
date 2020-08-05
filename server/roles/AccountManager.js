import mongoPoolPromise from "../helper/helperMongo.js";
import Manager from "./Manager.js";
import Account from "./Account.js";

class AccountManager extends Manager {
	constructor() {
		super();
	}

	find(username, returnAccount = false) {
		const index = this.items.findIndex(e => {
			e.decrypt();
			const result = e.username == username;
			e.encrypt();
			return result;
		});

		if (returnAccount) {
			return this.items[index];
		}
		return index;
	}

	add(account, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(account.username);
			if (index == -1) {
				this.items.push(account);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(account);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("account").find().toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const account of data) {
						Object.assign(account, {
							encrypted: true
						});
						const tempAcc = this.add(new Account(account));
						tempAcc.deploy();
						// tempAcc.uploadToDtb();
					}
				}
				resolve();
			});
		});
	}
}

export default AccountManager;
