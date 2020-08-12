import Manager from "../../../../../roles/Manager.js";

class Item extends Manager {
	constructor({
		id,
		name
	} = {}) {
		super();
		this.id = id;
		this.name = name;
	}

	getAmount() {
		return this.items.length;
	}

	find(participant, returnParticipant = false, autoAdd = false) {
		let index = this.items.indexOf(participant);
		if (index == -1 && autoAdd) {
			this.add(participant, false);
			index = this.find(participant);
		}

		if (returnParticipant) {
			return this.items[index];
		}
		return index;
	}

	add(participant, duplicateCheck = true) {
		if (duplicateCheck) {
			const index = this.find(participant);
			if (index == -1) {
				this.items.push(participant);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(participant);
		return this.bottom();
	}
}

export default Item;
