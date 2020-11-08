import Manager from "../../../../../roles/Manager.js";

class Item extends Manager {
	constructor({id, name} = {}) {
		super();
		this.id = id;
		this.name = name;
	}

	getAmount() {
		return this.items.length;
	}
}

export default Item;
