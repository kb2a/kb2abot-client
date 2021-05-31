const Manager = require('./Manager');

module.exports = class State extends Manager {
	constructor(options) {
		super(options);
		this.index = 0;
	}

	next() {
		this.index += this.index < this.items.length - 1 ? 1 : 0;
		return this.getCurrent();
	}

	previous() {
		this.index -= this.index > 0 ? 1 : 0;
		return this.getCurrent();
	}

	getCurrent() {
		return this.items[this.index];
	}

	reset() {
		this.index = 0;
	}

	end() {
		this.index = this.items.length - 1;
	}

	is(item) {
		// work only for text, if passing an array/object, will need reference
		return this.getCurrent() == item;
	}

	isEnd() {
		return this.index == this.items.length - 1;
	}
};
