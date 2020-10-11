import mongoPoolPromise from "../helper/helperMongo.js";
import Manager from "./Manager.js";
import Account from "./Account.js";

class AccountManager extends Manager {
	constructor() {
		super();
	}

	downloadFromDtb() {
		return new Promise(async resolve => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("account")
				.find()
				.toArray((error, data) => {
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
