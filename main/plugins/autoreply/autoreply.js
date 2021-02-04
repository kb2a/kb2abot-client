const fixEngineName = text => {
	text = String(text);
	const lower = text.toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const botengines = loader.load(__dirname+"/botengines");

module.exports = {
	fixEngineName,
	botengines
};
