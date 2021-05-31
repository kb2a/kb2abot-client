const fs = require('fs');
const path = require('path');
const safeStringify = require('fast-safe-stringify');
const Thread = require('./Thread');

module.exports = class Account extends kb2abot.helpers.Manager {
	constructor({id} = {}) {
		super();
		this.id = id;
		this.storage = {id};
	}

	storagePath() {
		return path.join(kb2abot.config.DIR.DATSTORE, `${this.id}.json`);
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
			const text = fs.readFileSync(this.storagePath());
			const accountStorage = JSON.parse(text);
			for (const threadStorage of accountStorage.__threads__) {
				const thread = this.addThread(threadStorage.__id__, threadStorage);
				delete thread.storage.__id__;
			}
			Object.assign(this.storage, accountStorage);
			delete this.storage.__threads__;
		} catch (e) {
			if (e.code == 'ENOENT') {
				// neu ko co file thi phai save truoc
				this.save();
				this.load();
			} else {
				throw new Error(`DATASTORE ${kb2abot.id} khong hop le!`);
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
			const save = safeStringify(
				accountStorage,
				(key, value) => (value == '[Circular]' ? undefined : value),
				kb2abot.config.PRETTY_DATASTORE ? '\t' : ''
			);
			fs.writeFileSync(this.storagePath(), save);
		} catch (e) {
			console.newLogger.error(e.stack);
		}
	}
};
