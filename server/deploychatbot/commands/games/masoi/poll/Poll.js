import Manager from "../../../../../roles/Manager.js";
import Item from "./Item.js";

class Poll extends Manager {
	constructor() {
		super();
	}

	find(id, returnItem = false, autoAdd = false) {
		let index = this.items.findIndex(e => e.id == id);
		if (index == -1 && autoAdd) {
			this.add(new Item({
				id
			}), false);
			index = this.find(id);
		}

		if (returnItem) {
			return this.items[index];
		}
		return index;
	}

	add(item, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(item.id);
			if (index == -1) {
				this.items.push(item);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(item);
		return this.bottom();
	}

	vote(itemID, senderID) {
		for (const item of this.items) {
			if (item.find(senderID) != -1) {
				item.delete(item.find(senderID, true));
			}
		}
		this.find(itemID, true).add(senderID);
	}

	unVoteAll(voterID) {
		for (const item of this.items) {
			item.delete(item.find(voterID, true));
		}
	}

	getFinalValue() {
		this.sort();
		if (this.top().getAmount() == this.items[1].getAmount()) {
			return undefined;
		}
		return this.top();
	}

	sort() {
		this.items.sort((a, b) => b.getAmount() - a.getAmount());
	}
}

export default Poll;
