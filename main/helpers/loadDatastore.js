const nedb = require("nedb-promises");
const path = require("path");

module.exports = async name => {
	const datastore = nedb.create(`datastores/${name}.db`);
	await datastore.load();
};