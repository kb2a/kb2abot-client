const fs = require('fs');
const path = require('path');
const {subname} = require('./helpers/common');

module.exports = dir => {
	const exportData = {};
	const files = fs
		.readdirSync(dir)
		.filter(
			filename =>
				fs.lstatSync(path.join(dir, filename)).isDirectory() ||
				filename.split('.').pop() == 'js'
		);
	for (const filename of files) {
		try {
			const data = require(path.join(dir, filename));
			const sname = subname(filename) || filename;
			if (sname == 'common') {
				Object.assign(exportData, data);
			} else {
				exportData[sname] = data;
			}
		} catch (e) {
			console.error(e.stack);
			continue;
		}
	}
	return exportData;
};
