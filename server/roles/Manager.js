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
		this.items.splice(index, 1);
	}
}

export default Manager;
