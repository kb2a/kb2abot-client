import Manager from "../../../../../roles/Manager.js";
import Item from "./Item.js";

class Poll extends Manager {
	constructor() {
		super();
	}

	vote(itemID, senderID) {
		for (const item of this.items) {
			const voter = item.find({
				id: senderID
			});
			if (voter) {
				item.delete(voter);
			}
		}
		const item = this.find({
			id: itemID
		});
		const query = {
			id: senderID
		};
		item.add(query, query);
	}

	unVoteAll(voterID) {
		for (const item of this.items) {
			item.delete(
				item.find({
					id: voterID
				})
			);
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
