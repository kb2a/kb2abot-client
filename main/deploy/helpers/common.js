/**
 * Chứa các function thông thường được sử dụng nhiều<br>
 * Hướng dẫn sử dụng:<br>
 * const {<tên hàm 1>, <tên hàm 2>} = kb2abot.helpers;<br>
 * Ví dụ:
 * <code>const {asyncWait, round, extend} = kb2abot.helpers;</code>
 * @module COMMON
 */
const fs = require('fs');
const axios = require('axios');
const minimist = require('minimist');
const childProcess = require('child_process');

/**
 * Hàm dừng chương trình async
 * @async
 * @param  {Number} time Thời gian bạn muốn dừng (milisecond)
 * @example
 * console.log("Loi! Vui long gui lai sau 5 giay")
 * kb2abot.helpers.asyncWait(5000).then(() => {
 * 	console.log("Ban co the gui lai duoc roi!");
 * });
 */
const asyncWait = async time => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};
/**
 * Hàm thực thi shell command
 * @async
 * @param  {String}  cmd shell command
 * @return {Promise} stdout hoặc stderr (nếu bị lỗi)
 * @example
 * console.log(await kb2abot.helpers.execShellCommand("echo Hello, world!"));
 * // "Hello, world!"
 */
const execShellCommand = cmd => {
	return new Promise(resolve => {
		childProcess.exec(cmd, (error, stdout, stderr) =>
			resolve(stdout ? stdout : stderr)
		);
	});
};
/**
 * Ràng buộc 1 giá trị trong khoảng từ [left; right]
 * @param  {Number} value Giá trị vào
 * @param  {Number} left  ràng buộc trái
 * @param  {Number} right ràng buộc phải
 * @return {Number} Giá trị trong khoảng [left; right]
 * @example
 * console.log(kb2abot.helpers.constrain(5, 1, 10);
 * // 5
 * console.log(kb2abot.helpers.constrain(-1, 1, 10);
 * // 1
 */
const constrain = (value, left, right) => {
	return value >= left ? (value <= right ? value : right) : left;
};
/**
 * Làm tròn đến chữ số thập phân x
 * @param  {Number} number Số bạn muốn làm tròn
 * @param  {Number} amount Số lượng chữ số thập phân (x)
 * @return {Number}        Số được làm tròn chữ số thập phân x
 * @example
 * kb2abot.helpers.round(Math.PI, 2);
 * // 3.14
 *
 * @example với cách dùng thứ hai này, code sẽ được đẹp hơn
 * const { round } = kb2abot.helpers;
 *
 * round(Math.PI, 2)
 * // 3.14
 */
const round = (number, amount) => {
	return parseFloat(Number(number).toFixed(amount));
};
/**
 * Kế thừa các thuộc tính của 1 object sâu (khác với Object.assign)
 * @param  {Object} object Object kế thừa
 * @param  {Object} deep Object bị kế thừa
 * @return {Object}        Object đã kế thừa
 * @example
 * const obj1 = {
 * 	a: {
 * 		b: true
 * 	}
 * };
 * const obj2 = {
 * 	a: {
 * 		c: "kb2abot"
 * 	}
 * }
 * kb2abot.helpers.extend(a, b);
 * // { a: { b: "kb2abot", c: true } }
 * }
 */
const extend = (obj, deep) => {
	let argsStart, deepClone;

	if (typeof deep === 'boolean') {
		argsStart = 2;
		deepClone = deep;
	} else {
		argsStart = 1;
		deepClone = true;
	}

	for (let i = argsStart; i < arguments.length; i++) {
		const source = arguments[i];

		if (source) {
			for (let prop in source) {
				if (deepClone && source[prop] && source[prop].constructor === Object) {
					if (!obj[prop] || obj[prop].constructor === Object) {
						obj[prop] = obj[prop] || {};
						extend(obj[prop], deepClone, source[prop]);
					} else {
						obj[prop] = source[prop];
					}
				} else {
					obj[prop] = source[prop];
				}
			}
		}
	}

	return obj;
};
/**
 * Dịch 1 đoạn văn bản thành các arguments (xài minimist để dịch)
 * @param  {String} text         Đoạn văn bản nào đó
 * @param  {String} [specialChar=א] Kí tự đặc biệt để xử lí quote
 * @return {Object}             Arguments
 * @example
 * //Xem ở đây: {@link https://www.npmjs.com/package/minimist} (nhớ CTRL + CLICK)
 */
const parseArgs = (str, specialChar) => {
	const quotes = ['"', '\'', '`'];
	for (let quote of quotes) {
		let tmp = str.split(quote);
		for (let i = 1; i < tmp.length; i += 2) {
			str = str.replace(
				`${quote}${tmp[i]}`,
				`${tmp[i].replace(/ /g, specialChar)}`
			);
			str = str.replace(quote, '');
		}
	}
	const output = [];
	str.split(' ').forEach(word => {
		output.push(word.replace(new RegExp(specialChar, 'g'), ' '));
	});
	return minimist(output);
};
/**
 * Lấy giá trị trong minimist arguments (Dùng chung với hàm parseArg)
 * @param  {Object} args           Args của minimist
 * @param  {Array} validList       Các trường mà bạn cần lấy giá trị
 * @return {Boolean|String|Number} Giá trị của trường đó
 * @example
 * const args = kb2abot.helpers.parseArg("kb2abot --version -s");
 * kb2abot.helpers.parseValue(args, ["version", "v"]);
 * // 1
 * kb2abot.helpers.parseValue(args, ["s"]);
 * // TRUE
 */
const parseValue = (args, validList) => {
	for (const param in args) {
		if (validList.indexOf(param) != -1) {
			const value = args[param];
			return typeof value == 'object' ? value[value.length - 1] : value;
		}
	}
	return undefined;
};
/**
 * Dịch json sang object
 * @param  {String} json JSON
 * @return {Promise}     Promise với JSON được dịch
 * @example
 * kb2abot.helpers.parseJSON('{"kb2abot": true}').then(result => {
 * 	console.log(result);
 * })
 * // {kb2abot: true}
 */
const parseJSON = text => {
	return new Promise((resolve, reject) => {
		try {
			resolve(JSON.parse(text));
		} catch (e) {
			reject(e);
		}
	});
};
/**
 * Xóa 1 file theo đường dẫn
 * @param  {String} path Đường dẫn tới file
 * @example
 * kb2abot.helpers.deleteFile(__dirname + "/test.txt");
 * // *File test.txt sẽ bị xóa*
 */
const deleteFile = path => {
	return new Promise((resolve, reject) => {
		try {
			fs.unlinkSync(path);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};
/**
 * Lấy keyword của 1 đoạn tin nhắn
 * @param  {String} text Đoạn tin nhắn của người dùng
 * @return {String}      Keyword của lệnh đó
 * @example
 * kb2abot.helpers.getKeyword("/help")
 * // "help"
 * kb2abot.helpers.getKeyword("/ytmp3 -s 'Anh yeu em'")
 * // "ytmp3"
 */
const getKeyword = text => {
	return text
		.split(' ')
		.slice(0, 1)[0]
		.slice(1);
};
/**
 * Tính dung lượng của file (theo mb)
 * @param  {String} path Đường dẫn tới file
 * @return {Number}      Dung lượng của file (mb)
 * @example
 * // file test.txt có dung lượng 1024KB
 * kb2abot.helpers.getFileSize(__dirname + "/test.txt");
 * // 1
 */
const getFileSize = path => {
	let fileSizeInBytes = fs.statSync(path)['size'];
	//Convert the file size to megabytes (optional)
	let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	return Math.round(fileSizeInMegabytes);
};
/**
 * Lấy tên file bỏ đuôi extension
 * @param  {String} text Tên file
 * @return {String}      Tên file không có đuôi
 * @example
 * kb2abot.helpers.subname("test.txt");
 * // "test"
 */
const subname = text => {
	return text
		.split('.')
		.slice(0, -1)
		.join('.');
};
/**
 * Chuyển 1 số về dạng mật mã đặc biệt (theo bảng chữ cái tiếng anh)
 * @param  {Number} number Số bạn muốn chuyển
 * @return {String}        Mã đặc biệt 1 = "o", 2 = "t",...
 * @example
 * kb2abot.helpers.numbersToWords(123);
 * // "oth"
 * kb2abot.helpers.numbersToWords(18102004);
 * // "ogoztzzf"
 */
const numberToPassword = number => {
	const numbers = ['z', 'o', 't', 'h', 'f', 'i', 's', 'e', 'g', 'n'];
	let str = number.toString();
	for (let i = 0; i < 10; i++) {
		str = str.replace(new RegExp(i, 'g'), numbers[i]);
	}
	return str;
};
/**
 *
 * @param  {String|Number} number Định dạng 1 string, number về dạng tiền tệ
 * @return {String}               Tiền tệ
 * @example
 * kb2abot.helpers.currencyFormat(1234567);
 * // "1,234,567"
 */
const currencyFormat = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 * Lấy dữ liệu của tin nhắn câu lệnh
 * @param  {String} text Lệnh người dùng nhập
 * @return {String}      1 text với keyword đã bị bỏ
 * @example
 * kb2abot.helpers.getParam("/help hello, good morning!");
 * // "hello, good morning!"
 */
const getParam = text => {
	return text
		.split(' ')
		.slice(1)
		.join(' ');
};
/**
 * Loại bỏ các kí tự lạ trong văn bản
 * @param  {String} text Văn bản nào đó
 * @return {String}      Văn bản sạch
 */
const removeSpecialChar = str => {
	if (str === null || str === '') return false;
	else str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, '');
	// return str;
};

/**
 * thực hiện phép lấy giá trị ngẫu nhiên
 * @example
 * const { random } = kb2abot.helpers;
 *
 * random(1, 10)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10
 *
 * // lưu ý: vì phép ngẫu nhiên này không được làm tròn vì vậy bạn nên dùng random cùng với round
 * @example
 * const { random, round } = kb2abot.helpers;
 *
 * round(random(1, 10), 2)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10 và được làm chòn đến chữ số thập phân thứ hai
 *
 */
const random = (start, end) => {
	return Math.floor(Math.random() * (end - start + 1) + start);
};

const shuffle = arr => {
	// thuật toán bogo-sort
	let count = arr.length,
		temp,
		index;

	while (count > 0) {
		index = Math.floor(Math.random() * count);
		count--;
		temp = arr[count];
		arr[count] = arr[index];
		arr[index] = temp;
	}

	return arr; //Bogosort with no điều kiện dừng
};

const getInstructor = (title, commands) => {
	let out = `===${title}===\nDanh sách lệnh:\n`;
	for (let i = 0; i < commands.length; i++) {
		out += `${i + 1}. ${commands[i]}\n`;
	}
	return out;
};

const validURL = str => {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator
	return !!pattern.test(str);
};

const downloadFile = async (fileUrl, outputLocationPath) => {
	const writer = fs.createWriteStream(outputLocationPath);

	const response = await axios({
		method: 'get',
		url: fileUrl,
		responseType: 'stream'
	});

	await new Promise((resolve, reject) => {
		response.data.pipe(writer);
		let error = null;
		writer.on('error', err => {
			error = err;
			writer.close();
			reject(err);
		});
		writer.on('close', () => {
			if (!error) {
				resolve(true);
			}
		});
	});
};

const getFile = filePath => {
	return fs.createReadStream(filePath)
};

module.exports = {
	round,
	extend,
	subname,
	parseArgs,
	constrain,
	parseJSON,
	asyncWait,
	execShellCommand,
	deleteFile,
	parseValue,
	getKeyword,
	getFileSize,
	getFile,
	numberToPassword,
	currencyFormat,
	getParam,
	removeSpecialChar,
	random,
	shuffle,
	getInstructor,
	validURL,
	downloadFile
};
