class Manager {
	constructor() {
		this.items = [];
		this.updating = false;
	}

	getLength() {
		return this.items.length;
	}

	top() {
		return this.items[0];
	}

	bottom() {
		return this.items[this.items.length - 1];
	}

	delete(item) {
		let index = this.items.indexOf(item);
		if (index != -1)
			this.items.splice(index, 1);
	}

	clear() {
		this.items.splice(0, this.items.length);
	}
}

export default Manager;
