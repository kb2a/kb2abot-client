var a = require("minimist");
var str = `/yt --search asdadas asd --search test`;

function parseArg(str) {
	const quotes = ['"', "'", '`'];
	for (let quote of quotes) {
		let tmp = str.split(quote);
		for (let i = 1; i < tmp.length; i += 2) {
			str = str.replace(`${quote}${tmp[i]}`, `${tmp[i].replace(/ /g, "Ø")}`);
			str = str.replace(quote, "");
		}
	}
	return a(str.split(" "));
}

console.log(parseArg(str));
