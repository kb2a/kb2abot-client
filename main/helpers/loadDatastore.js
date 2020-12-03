const nedb = require("nedb-promises");

module.exports = async name => {
	const datastore = nedb.create(`datastores/${name}.db`);
	await datastore.load();
};
