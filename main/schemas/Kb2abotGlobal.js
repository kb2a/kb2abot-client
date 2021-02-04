const Schema = require("./Schema");

module.exports = class Kb2abotGlobalSchema extends Schema {
	constructor(options = {}) {
		super(options);
		const {
			id = 0,
			helpers = {},
			plugins = {},
			schemas = {},
			account = {},
		} = options;
		this.id = id;
		this.helpers = helpers; // các helpers trong ./helpers
		this.schemas = schemas; // các plugins trong ./plugins
		this.plugins = plugins; // các plugins trong ./schemas
		this.account = account;
	}
};
