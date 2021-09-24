/**
 * Chứa các function thông thường được sử dụng nhiều<br>
 * Hướng dẫn sử dụng:<br>
 * import {<tên hàm 1>, <tên hàm 2>} from "./common.util.js"<br>
 * Ví dụ:
 * <code>import {asyncWait, round, extend} from "./common.util.js"</code>
 * @module COMMON
 */
import fs from 'fs'
import axios from 'axios'
import minimist from 'minimist'

/**
 * Hàm dừng chương trình async
 * @async
 * @param  {Number} time Thời gian bạn muốn dừng (milisecond)
 * @example
 * console.log("Loi! Vui long gui lai sau 5 giay")
 * asyncWait(5000).then(() => {
 *  console.log("Ban co the gui lai duoc roi!");
 * });
 */
export const asyncWait = async time => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};
/**
 * Ràng buộc 1 giá trị trong khoảng từ [left; right]
 * @param  {Number} value Giá trị vào
 * @param  {Number} left  ràng buộc trái
 * @param  {Number} right ràng buộc phải
 * @return {Number} Giá trị trong khoảng [left; right]
 * @example
 * console.log(constrain(5, 1, 10);
 * // 5
 * console.log(constrain(-1, 1, 10);
 * // 1
 */
export const constrain = (value, left, right) => {
	return value >= left ? (value <= right ? value : right) : left;
};
/**
 * Làm tròn đến chữ số thập phân x
 * @param  {Number} number Số bạn muốn làm tròn
 * @param  {Number} amount Số lượng chữ số thập phân (x)
 * @return {Number}        Số được làm tròn chữ số thập phân x
 * @example
 * round(Math.PI, 2);
 * // 3.14
 *
 * @example với cách dùng thứ hai này, code sẽ được đẹp hơn
 * import { round } from "./common.util.js"
 *
 * round(Math.PI, 2)
 * // 3.14
 */
export const round = (number, amount) => {
	return parseFloat(Number(number).toFixed(amount));
};
/**
 * Kế thừa các thuộc tính của 1 object sâu (khác với Object.assign)
 * @param  {Object} object Object kế thừa
 * @param  {Object} deep Object bị kế thừa
 * @return {Object}        Object đã kế thừa
 * @example
 * const obj1 = {
 *  a: {
 *    b: true
 *  }
 * };
 * const obj2 = {
 *  a: {
 *    c: "kb2abot"
 *  }
 * }
 * extend(a, b);
 * // { a: { b: "kb2abot", c: true } }
 * }
 */
export const extend = (obj, deep) => {
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
export const parseArgs = (str, specialChar) => {
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
 * const args = parseArg("kb2abot --version -s");
 * parseValue(args, ["version", "v"]);
 * // 1
 * parseValue(args, ["s"]);
 * // TRUE
 */
export const parseValue = (args, validList) => {
	for (const param in args) {
		if (validList.indexOf(param) != -1) {
			const value = args[param];
			return typeof value == 'object' ? value[value.length - 1] : value;
		}
	}
	return undefined;
};
/**
 * Xóa 1 file theo đường dẫn
 * @param  {String} path Đường dẫn tới file
 * @example
 * deleteFile(__dirname + "/test.txt");
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
 * getKeyword("/help")
 * // "help"
 * getKeyword("/ytmp3 -s 'Anh yeu em'")
 * // "ytmp3"
 */
export const getKeyword = text => {
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
 * getFileSize(__dirname + "/test.txt");
 * // 1
 */
export const getFileSize = path => {
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
 * subname("test.txt");
 * // "test"
 */
export const subname = text => {
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
 * numbersToWords(123);
 * // "oth"
 * numbersToWords(18102004);
 * // "ogoztzzf"
 */
export const numberToPassword = number => {
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
 * currencyFormat(1234567);
 * // "1,234,567"
 */
export const currencyFormat = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 * Lấy dữ liệu của tin nhắn câu lệnh
 * @param  {String} text Lệnh người dùng nhập
 * @return {String}      1 text với keyword đã bị bỏ
 * @example
 * getParam("/help hello, good morning!");
 * // "hello, good morning!"
 */
export const getParam = text => {
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
export const removeSpecialChar = str => {
	if (str === null || str === '') return false;
	else str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, '');
	// return str;
};

/**
 * thực hiện phép lấy giá trị ngẫu nhiên
 * @example
 * import { random } from "./common.util.js";
 *
 * random(1, 10)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10
 *
 * // lưu ý: vì phép ngẫu nhiên này không được làm tròn vì vậy bạn nên dùng random cùng với round
 * @example
 * import { random, round } from "./common.util.js";
 *
 * round(random(1, 10), 2)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10 và được làm chòn đến chữ số thập phân thứ hai
 *
 */
export const random = (start, end) => {
	return Math.floor(Math.random() * (end - start + 1) + start);
};

export const shuffle = arr => {
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

export const validURL = str => {
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

export const downloadFile = async (fileUrl, outputLocationPath) => {
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

export const convert_to_string_time = (time = 0) => {
	if (time < 0) time = 0
	const hh = Math.floor(time / 1000 / 60 / 60)
	const mm = Math.floor((time - hh * 60 * 60 * 1000) / 1000 / 60)
	const ss = Math.ceil((time - hh * 60 * 60 * 1000 - mm * 60 * 1000) / 1000)
	let text = `${ss}s`
	if (mm > 0) text = `${mm}m ${text}`
	if (hh > 0) text = `${hh}h ${text}`
	return text
}

export const deepEqual = (x, y) => {
	if (x === y) {
		return true;
	} else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
		if (Object.keys(x).length != Object.keys(y).length)
			return false;

		for (var prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!deepEqual(x[prop], y[prop]))
					return false;
			} else
				return false;
		}

		return true;
	} else
		return false;
}

export const importJSON = pathToJson => JSON.parse(fs.readFileSync(pathToJson))