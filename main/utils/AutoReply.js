const fixEngineName = text => {
	let lower = text.toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
};

module.exports = {
	fixEngineName
};
