import minimist from "minimist";

const parseArg = function(str, specialChar) {
	const quotes = ["\"", "'", "`"];
	for (let quote of quotes) {
		let tmp = str.split(quote);
		for (let i = 1; i < tmp.length; i += 2) {
			str = str.replace(`${quote}${tmp[i]}`, `${tmp[i].replace(/ /g, specialChar)}`);
			str = str.replace(quote, "");
		}
	}
	const output = [];
	str.split(" ").forEach(word => {
		output.push(word.replace(new RegExp(specialChar, "g"), " "));
	});
	return minimist(output);
};

export {
	parseArg
};
