const uniqid = require('uniqid');

module.exports = class Kb2abotGlobalSchema {
	constructor({
		id = uniqid(),
		name = '',
		schemas = {},
		helpers = {},
		plugins = {},
		games = {},
		account = {},
		pluginManager = {},
		gameManager = {},
		cookie = {},
		config = require('./CONFIG')
	} = {}) {
		this.id = id;
		this.name = name;
		this.schemas = schemas; // các schema trong /schemas
		this.helpers = helpers; // các helper trong /helpers
		this.plugins = plugins; // các plugin trong /plugins
		this.games = games; // các game trong /games
		this.account = account; // instance của deploy/roles/Account
		this.pluginManager = pluginManager; // instance của helpers/PluginManager
		this.gameManager = gameManager; // instance của helpers/GameManager
		this.cookie = cookie;
		this.config = config;
	}
};
