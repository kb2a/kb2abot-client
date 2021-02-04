const fs = require("fs");
const safeStringify = require("fast-safe-stringify");
const Thread = require("./Thread");

module.exports = class Account extends kb2abot.helpers.Manager {
	constructor({id} = {}) {
		super();
		this.id = id;
		this.storage = {};
	}

	addThread(id) {
		return this.add(
			new Thread({
				id,
				owner: this.id
			}),
			{id}
		);
	}

	load() {
		try {
			const text = fs.readFileSync(`datastores/${kb2abot.id}.json`);
			const accountStorage = JSON.parse(text);
			for (const threadStorage of accountStorage.__threads__) {
				const thread = this.addThread(threadStorage.__id__);
				thread.storage = {...threadStorage};
				delete thread.storage.__id__;
			}
			Object.assign(this.storage, accountStorage);
			delete this.storage.__threads__;
		} catch (e) {
			console.log(e);
			throw "DATASTORE khong hop le!";
		}
	}

	save() {
		try {
			const accountStorage = {...this.storage};
			accountStorage.__threads__ = [];
			for (const thread of this.items) {
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
	}
};
