import mongoPoolPromise from "../helper/helperMongo.js";
import Manager from "./Manager.js";
import Group from "./Group.js";

class GroupManager extends Manager {
	constructor({
		owner,
		live = true,
		listen = true
	} = {}) {
		super();

		this.owner = owner; // owner là username đã bị encrypt
		this.live = live;
		this.listen = listen;
	}

	find(id, returnGroup = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Group({
				id,
				owner: this.owner
			}), false);
			index = this.find(id);
		}

		if (returnGroup) {
			return this.items[index];
		}
		return index;
	}

	add(group, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(group.id);
			if (index == -1) {
				this.items.push(group);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(group);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("group").find({
				owner: this.owner
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const group of data) {
						this.add(new Group(group));
					}
				}
				resolve();
			});
		});
	}

	downloadAllFromFacebook(api) {
		for (const group of this.items) {
			group.downloadFromFacebook(api);
		}
	}
}

export default GroupManager;
