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
			pluginManager = {},
			gameManager = {},
		} = options;
		this.id = id;
		this.helpers = helpers; 							// các helpers trong /helpers
		this.schemas = schemas; 							// các schemas trong /plugins
		this.plugins = plugins; 							// các plugins trong /schemas
		this.account = account; 							// instance của deploy/roles/Account
		this.pluginManager = pluginManager;		// instance của helpers/PluginManager
		this.gameManager = gameManager;			// instance của helpers/GameManager
	}
};
