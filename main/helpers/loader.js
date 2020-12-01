const fs = require("fs");
const path = require("path");
const log = require('log-to-file');
const logger = require("node-color-log");

const { subname } = require("../utils/COMMON.js");

module.exports = (type, silent = false) => {
    const datas = {};
    const dateTime = new Date(Date.now()).toISOString();
    const myLog = path.join(__dirname, "../..", "logs", dateTime.replace(/:/g,".") + ".log");
    if (["utils", "plugins"].indexOf(type) == -1) {
        throw "[LOADER] - Unsupported type: " + type;
        process.exit();
    }
    const dir = path.join(__dirname, "..", type);
    const fileNames = fs
        .readdirSync(dir)
        .filter(name => name.indexOf(".js") != -1);
    for (const fileName of fileNames) {
        const name = subname(fileName);
        try {
            const data = require(path.join(dir, fileName));
            if (name == "COMMON") {
                Object.assign(datas, data);
            } else {
                datas[name] = data;
            }
            if (!silent) {
                const msg = `${type.toUpperCase()} - LOADED: ${name}`;
                logger.info(msg);
                log(msg, myLog);
            }
        } catch (e) {
            if (!silent) {
                const msg = `${type.toUpperCase()} - COULDN'T LOADED: ${name}`;
                logger.error(msg);
                logger.error(e.message);
                log(msg, myLog);
                log(e.message, myLog);
            }
        }
    }
    return datas;
};