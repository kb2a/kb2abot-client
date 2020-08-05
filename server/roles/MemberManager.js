import mongoPoolPromise from "../helper/helperMongo.js";
import Manager from "./Manager.js";
import Member from "./Member.js";

class MemberManager extends Manager {
	constructor({
		owner
	} = {}) {
		super();
		this.owner = owner;
	}

	find(id, returnMember = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Member({
				id,
				owner: this.owner
			}), false);
			index = this.find(id);
		}

		if (returnMember) {
			return this.items[index];
		}
		return index;
	}

	add(member, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(member.id);
			if (index == -1) {
				this.items.push(member);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(member);
		return this.bottom();
	}

	downloadFromDtb() {
		return new Promise(async (resolve) => {
			this.updating = true;

			setTimeout(() => {
				this.updating = false;
			}, 60000);

			const dtb = await mongoPoolPromise();
			dtb.collection("member").find({
				owner: this.owner
			}).toArray((error, data) => {
				if (error) throw error;
				if (data.length > 0) {
					for (const member of data) {
						this.add(new Member(member));
					}
				}
				resolve();
			});
		});
	}
}

export default MemberManager;
