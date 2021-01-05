const fs = require("fs");
const path = require("path");
const log = require("log-to-file");
const detective = require("detective");

const {subname, execShellCommand} = require("../utils/COMMON");

module.exports = async (type, silent = false) => {
	const datas = {};
	const dateTime = new Date(Date.now()).toISOString();
	const myLog = path.join(
		__dirname,
		"../..",
		"logs",
		dateTime.replace(/:/g, ".") + ".log"
	);
	if (["utils", "plugins"].indexOf(type) == -1) {
		throw "Unsupported type: " + type;
	}
	const dir = path.join(__dirname, "..", type);
	const fileNames = fs
		.readdirSync(dir)
		.filter(name => name.indexOf(".js") != -1);
	for (const fileName of fileNames) {
		let checker = {
			is_MODULE_NOT_FOUND: true,
			last_modules: [],
			count: 0
		};
		do {
			const name = subname(fileName);
			try {
				const data = require(path.join(dir, fileName));
				if (data.disable && !silent) { // disabled plugin
					const msg = `${type.toUpperCase()} - DISABLED: ${name}`;
					console.newLogger.warn(msg);
					log(msg, myLog);
				} else { // non-disabled plugin
					if (name == "COMMON") {
						Object.assign(datas, data);
					} else {
						datas[name] = data;
					}
					if (!silent) {
						const msg = `${type.toUpperCase()} - LOADED: ${name}`;
						console.newLogger.success(msg);
						log(msg, myLog);
					}
				}
				checker.is_MODULE_NOT_FOUND = false;
			} catch (e) {
				if (!silent) {
					if (e.code == "MODULE_NOT_FOUND") {
						checker.count++;
						if (checker.count > 10) {
							console.log(`\nHe thong nhan thay ban dang o trong vong lap\nVui long kiem tra lai file ${e.requireStack[0]}!`);
							process.exit();
						}
						const requires = detective(fs.readFileSync(e.requireStack[0]));
						const modules = requires.filter((e, index) =>
							!e.includes("./") && // remove relative module
							requires.indexOf(e) == index && // remove dupplicate
							(()=>{
								try{
									require(e);
									return false;
								}catch(e){
									return true;
								}})()); // remove installed module
						let equal = true;
						for (const m of modules) {
							if (!checker.last_modules.includes(m)) {
								equal = false;
								break;
							}
						}
						checker.last_modules = [...modules];
						const commaJoin = modules.join(", ");
						if (equal) {
							console.log(`\nKhong the tu dong cai dependencies: ${commaJoin}`);
							console.log(`Vui long tu cai bang cach nhap: npm i ${commaJoin}`);
							process.exit();
						} else {
							const shellCommand = `npm i ${modules.join(" ")}`;
							console.log(`Dang tu dong cai cac dependencies: ${commaJoin}`);
							await execShellCommand(shellCommand);
						}
						continue;
					}
					const msg = `${type.toUpperCase()} - COULDN'T LOADED: ${name}`;
					console.newLogger.error(msg);
					console.newLogger.error(e);
					log(msg, myLog);
					log(JSON.stringify(e), myLog);
					checker.is_MODULE_NOT_FOUND = false;
				}
			}
		} while (checker.is_MODULE_NOT_FOUND);
		if (type == "plugins") {
			try {
				await require(path.join(dir, fileName)).onLoad();
			}
			catch(e) {
				if (!silent)
					console.newLogger.error("onLoad -> " + e.message);
			}
		}
	}
	return datas;
};
