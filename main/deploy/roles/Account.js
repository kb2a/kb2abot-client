const fs = require("fs");
const safeStringify = require("fast-safe-stringify");
const Thread = require("./Thread");

module.exports = class Account extends kb2abot.helpers.Manager {
	constructor({id} = {}) {
		super();
		this.id = id;
		this.storage = new kb2abot.schemas.storage.Account();
	}

	addThread(id, storage = {}) {
		return this.add(
			new Thread({
				id,
				owner: this.id,
				storage
			}),
			{id}
		);
	}

	load() {
		try {
			const text = fs.readFileSync(`datastores/${kb2abot.id}.json`);
			const accountStorage = JSON.parse(text);
			for (const threadStorage of accountStorage.__threads__) {
				const thread = this.addThread(threadStorage.__id__, {...threadStorage});
				delete thread.storage.__id__;
			}
			this.storage.extend({...accountStorage});
			delete this.storage.__threads__;
		} catch (e) {
			if (e.code == "ENOENT") {
				this.save();
				this.load();
			} else {
				throw new Error("DATASTORE khong hop le!");
			}
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
			console.newLogger.error(e.stack);
		}
	}
};
