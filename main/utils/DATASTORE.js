/**
 * Các function xử lí datastore
 * @module DATASTORE
 */
const fs = require("fs");
const safeStringify = require("fast-safe-stringify");

/**
 * Load datastore và import vào kb2abot
 */
const load = () => {
	try {
		const text = fs.readFileSync(`datastores/${kb2abot.id}.json`);
		const accountStorage = JSON.parse(text);
		for (const threadStorage of accountStorage.__threads__) {
			const thread = kb2abot.account.addThread(threadStorage.__id__);
			thread.storage = {...threadStorage};
			delete thread.storage.__id__;
		}
		Object.assign(kb2abot.account.storage, accountStorage);
		delete kb2abot.account.storage.__threads__;
	} catch (e) {
		console.log(e);
		throw "DATASTORE khong hop le!";
	}
};
/**
 * Export hết data và lưu vào file json
 */
const save = () => {
	try {
		const accountStorage = {...kb2abot.account.storage};
		accountStorage.__threads__ = [];
		for (const thread of kb2abot.account.items) {
			accountStorage.__threads__.push({
				__id__: thread.id,
				...thread.storage
			});
		}
		const save = safeStringify(accountStorage, (key, value) =>
			value == "[Circular]" ? undefined : value
		);
		fs.writeFileSync(`datastores/${kb2abot.id}.json`, save);
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	load,
	save
};
