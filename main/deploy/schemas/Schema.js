const uniqid = require('uniqid');

module.exports = class Schema {
	constructor() {
		this.id = uniqid();
		this.createAt = Date.now();
	}

	upTime() {
		return Date.now() - this.createAt;
	}
};
