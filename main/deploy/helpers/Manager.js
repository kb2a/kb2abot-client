module.exports = class Manager {
	constructor(items = []) {
		this.items = items;
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

	clear() {
		this.items.splice(0, this.items.length);
	}

	find(query, options) {
		const isObject = typeof options == 'object';

		const returnIndex = Boolean(
			(isObject ? options.returnIndex : arguments[1]) || false
		);

		const indexFind = this.items.findIndex(item => {
			for (const property in query) {
				if (query[property] != item[property]) {
					return false;
				}
			}
			return true;
		});
		if (returnIndex) return indexFind;
		return this.items[indexFind];
	}

	add(item, findQuery = {}) {
		// addingCondition is a condition for checking duplicate of the item before adding
		if (Object.keys(findQuery).length != 0) {
			const index = this.find(findQuery, {
				returnIndex: true
			});
			if (index == -1) {
				this.items.push(item);
				return this.bottom();
			}
			return this.items[index];
		}

		this.items.push(item);
		return this.bottom();
	}

	delete(queryObject) {
		const itemIndex = this.find(queryObject, {
			returnIndex: true
		});
		if (itemIndex != -1) this.items.splice(itemIndex, 1);
	}
};
