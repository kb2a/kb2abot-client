const mongoPoolPromise = kb2abot.

const downloadData = (collection, RoleClass) => {
	try {
		const dtb = await mongoPoolPromise();
		dtb.collection(collection)
			.find({
				owner: this.owner
			})
			.toArray((error, items) => {
				if (error) throw error;
				for (const item of items) {
					const tmp = this.find({ id: item.id });
					if (!tmp) {
						this.add(new RoleClass(item));
					} else {
						Object.assign(tmp, item);
					}
				}
			});
	} catch (e) {
		console.log(e.message);
	}
}

module.exports = {
	downloadData,
};