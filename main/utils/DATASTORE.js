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
		const groupStorages = accountStorage.__groups__;
		delete accountStorage.__groups__;
		Object.assign(kb2abot.account.storage, accountStorage);
		for (const groupStorage of groupStorages) {
			const id = groupStorage.__id__;
			const memberStorages = groupStorage.__members__;
			delete groupStorage.__id__;
			delete groupStorage.__members__;
			const group = kb2abot.account.addGroup(id, kb2abot.id);
			Object.assign(group.storage, groupStorage);
			for (const memberStorage of memberStorages) {
				const id = memberStorage.__id__;
				delete memberStorage.__id__;
				const member = group.addMember(id, group.id);
				Object.assign(member.storage, memberStorage);
			}
		}
	} catch (e) {
		if (e.code != "ENOENT") console.log(e);
	}
};
/**
 * Export hết data và lưu vào file json
 */
const save = () => {
	try {
		const accountStorage = {};
		Object.assign(accountStorage, kb2abot.account.storage);
		accountStorage.__groups__ = [];
		for (const group of kb2abot.account.items) {
			const groupStorage = {};
			Object.assign(groupStorage, group.storage);
			groupStorage.__id__ = group.id;
			groupStorage.__members__ = [];
			for (const member of group.items) {
				const memberStorage = {};
				Object.assign(memberStorage, member.storage);
				memberStorage.__id__ = group.id;
				groupStorage.__members__.push(memberStorage);
			}
			accountStorage.__groups__.push(groupStorage);
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
