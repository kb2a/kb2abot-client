const fs = require("fs");
const path = require("path");
const log = require("log-to-file");
const detective = require("detective");

const supportTypes = ["bootloader", "helpers", "plugins", "schemas", "games"];
const {subname, execShellCommand} = require("./helpers/common");

const load = dir => {
	const exportData = {};
	const files = fs
		.readdirSync(dir)
		.filter(filename => fs.lstatSync(path.join(dir, filename)).isDirectory() || filename.includes(".js"));
	for (const filename of files) {
		try {
			const data = require(path.join(dir, filename));
			const sname = subname(filename) || filename;
			if (sname == "common") {
				Object.assign(exportData, data);
			} else {
				exportData[sname] = data;
			}
		}
		catch {
			continue;
		}
	}
	return exportData;
};

const slowLoad = async (type, dir = path.join(__dirname, type)) => { //meticulous load
	const exportData = {};
	const dateTime = new Date(Date.now()).toISOString();
	const myLog = path.join(
		__dirname,
		"../../logs",
		dateTime.replace(/:/g, ".") + ".log"
	);
	if (supportTypes.indexOf(type) == -1) {
		throw new Error("Unsupported type: " + type);
	}
	const files = fs
		.readdirSync(dir)
		.filter(filename => fs.lstatSync(path.join(dir, filename)).isDirectory() || filename.indexOf(".js") != -1);
	for (const filename of files) {
		let checker = {
			is_MODULE_NOT_FOUND: true,
			last_modules: [],
			loopCount: 0
		};
		do {
			const sname = subname(filename) || filename;
			try {
				const data = require(path.join(dir, filename));

				if (type == "plugins" && data.disable) { // disabled plugin logger
					const msg = `${type.toUpperCase()} - DISABLED: ${sname}`;
					console.newLogger.warn(msg);
					log(msg, myLog);
					break;
				}

				if (sname == "common") {
					Object.assign(exportData, data);
				} else {
					exportData[sname] = data;
				}

				const msg = `${type.toUpperCase()} - LOADED: ${sname}`;
				console.newLogger.success(msg);
				log(msg, myLog);

				checker.is_MODULE_NOT_FOUND = false;
			} catch (e) {
				if (e.code == "MODULE_NOT_FOUND") {
					const filePath = fs.readFileSync(e.requireStack[0]);
					const plain = detective(filePath);
					const requiredModules = plain.filter((e, index) =>
						!e.includes("./") && // remove relative path require
						plain.indexOf(e) == index && // remove dupplicate
						(()=>{
							try{
								require(e);
								return false;
							}catch(e){
								return true;
							}})()); // remove installed module

					let notChanged = true;
					for (const m of requiredModules) {
						if (!checker.last_modules.includes(m)) {
							notChanged = false;
							break;
						}
					}
					checker.last_modules = [...requiredModules];

					const commaJoin = requiredModules.join(", ");
					if (notChanged) {
						checker.loopCount++;
						if (checker.loopCount >= 3) {
							throw new Error(`He thong nhan thay ban dang o trong vong lap, vui long kiem tra lai file ${e.requireStack[0]}!`);
						}
						if (requiredModules.length > 0) {
							throw new Error(`Khong the tu dong cai dependencie(s): ${commaJoin}`);
						} else {
							throw e;
						}
					} else {
						checker.loopCount = 0;
						const shellCommand = `npm i ${requiredModules.join(" ")}`;
						console.log(`Dang tu dong cai cac dependencie(s): ${commaJoin}`);
						await execShellCommand(shellCommand);
					}
				} else {
					const msg = `${type.toUpperCase()} - COULDN'T LOADED: ${sname}`;
					console.newLogger.error(msg);
					console.newLogger.error(e.stack);
					log(msg, myLog);
					log(e.stack, myLog);
					checker.is_MODULE_NOT_FOUND = false;
				}
			}
		} while (checker.is_MODULE_NOT_FOUND);
	}
	return exportData;
};

module.exports = {
	load,
	slowLoad
};
