const axios = require('axios');

const google = async (text, from = 'auto', to = 'vi') => {
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${from}&tl=${to}&dt=t&q=${text}`;
		const res = await axios.get(url);
		return res.data[0][0][0];
	} catch (e) {
		console.error(e);
		return text;
	}
};

module.exports = {
	google
};
