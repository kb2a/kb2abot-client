const axios = require('axios');
const recursive = require('recursive-readdir');
const fs = require('fs');
const path = require('path');
const log = require('log-to-file');
const detective = require('detective');
const {execShellCommand} = require('./common');
const Manager = require('./Manager');

module.exports = class PluginManager extends Manager {
	constructor() {
		super();
		this.log = '';
	}

	findCommandsByKeyword(keyword, store = this.items, className, index = 0) {
		const out = [];
		for (const cmd of store) {
			const childCmd = this.findCommandsByKeyword(
				keyword,
				cmd._.childs,
				`${className ? className + '.' : ''}${cmd.keywords[0]}`,
				index + 1
			);
			out.push(...childCmd);
			if (cmd.keywords.includes(keyword))
				out.push({
					index,
					className: `${className ? className + '.' : ''}${keyword}`,
					command: cmd
				});
		}
		return out;
	}

	findCommandsByClasses(classes, store = this.items, index = 0) {
		const keywords = classes.split('.');
		if (index == 0 && keywords[index] == 'kb2abot') index++;
		for (const cmd of store) {
			if (cmd.keywords.includes(keywords[index])) {
				if (index < keywords.length - 1)
					return this.findCommandsByClasses(classes, cmd._.childs, index + 1);
				else return cmd;
			}
		}
	}

	getAllCommands(store = this.items) {
		const out = [...store];
		for (const command of store) {
			out.push(...this.getAllCommands(command._.childs));
		}
		return out;
	}

	async loadAllPlugins(plgDir = kb2abot.config.DIR.PLUGIN, silent = true) {
		const files = (await recursive(plgDir)).filter(
			file => path.basename(file) == 'manifest.json'
		);
		for (const file of files) {
			const cfg = require(file);
			if (cfg.disable) {
				!silent && console.newLogger.warn(`PLUGINS - DISABLED: ${cfg.name}`);
				continue;
			}
			try {
				this.add(await this.loadCommand(path.join(file, '..', cfg.entry)));
			} catch (e) {
				log(
					e.stack,
					path.join(
						path.join(__dirname, '../../../logs'),
						new Date(Date.now()).toISOString().replace(/:/g, '.') + '.log'
					)
				);
				!silent && console.newLogger.warn(`PLUGIN ${cfg.name} --> ${e.stack}`);
			} finally {
				!silent &&
					console.newLogger.success(
						`PLUGINS - LOADED: ${cfg.name} | Tac gia: ${cfg.authorDetails.name} (${cfg.authorDetails.contact}) [${cfg.version}]`
					);
			}
		}
	}

	async loadCommand(cmdPath) {
		const checker = {
			is_MODULE_NOT_FOUND: true,
			last_modules: [],
			loopCount: 0
		};
		do {
			try {
				require(cmdPath);
				checker.is_MODULE_NOT_FOUND = false;
			} catch (e) {
				if (e.code == 'MODULE_NOT_FOUND') {
					if (path.basename(e.requireStack[0]) == 'PluginManager.js')
						throw new Error(`Required child file not found (${cmdPath})`);
					const filePath = fs.readFileSync(e.requireStack[0]);
					const originalModules = detective(filePath);
					const filteredModules = originalModules.filter(
						(requirement, index) =>
							!requirement.includes('./') && // remove relative path require
							originalModules.indexOf(requirement) == index && // remove dupplicate
							(() => {
								try {
									require(requirement);
									return false;
								} catch {
									return true;
								}
							})()
					); // remove installed module

					for (const dep of filteredModules) {
						try {
							await axios.get('https://www.npmjs.com/package/' + dep);
						} catch {
							console.newLogger.error(`Dependency "${dep}" khong co tren npm!`);
							throw new Error(
								`Dependency "${dep}" khong hop le, vui long kiem tra lai file ${e.requireStack[0]}!`
							);
						}
					}

					let changed = false;
					for (const m of checker.last_modules) {
						if (!filteredModules.includes(m)) {
							changed = true;
							break;
						}
					}
					checker.last_modules = [...filteredModules];

					const commaJoin = filteredModules.join(', ');
					if (!changed) {
						// not changed any dependencie(s)
						checker.loopCount++;
						if (checker.loopCount >= 3)
							throw new Error(
								`Khong the tu dong cai dependencie(s): ${commaJoin}. He thong nhan thay ban dang o trong vong lap, vui long kiem tra lai file ${e.requireStack[0]}!`
							);
					} else {
						checker.loopCount = 0;
					}
					const shellCommand = `npm install ${filteredModules.join(' ')}`;
					console.newLogger.debug(
						`Dang tu dong cai cac dependencie(s): ${commaJoin}`
					);
					console.newLogger.debug('> ' + shellCommand);
					try {
						await execShellCommand(shellCommand);
						console.newLogger.success(
							`Da cai xong cac dependencie(s): ${commaJoin}, vui long chay lai bot!`
						);
						process.exit();
					} catch (e) {
						console.newLogger.error(
							`Gap loi khi chay > npm install cac dependencie(s): ${commaJoin}!`
						);
						throw e;
					}
				} else {
					throw e;
				}
			}
		} while (checker.is_MODULE_NOT_FOUND);

		const newCmd = {
			...{
				keywords: [],
				name: 'Không tên',
				description: 'trống',
				guide: 'trống',
				childs: [],
				permission: {
					'*': '*'
				},
				datastoreDesign: {
					account: {
						global: {},
						local: {}
					},
					thread: {
						global: {},
						local: {}
					}
				},
				async onLoad() {},
				hookType: 'none',
				async onMessage(message, reply) {},
				async onCall(message, reply) {},
				_: {
					childs: [],
					extendedDatastoreDesigns: [],
					path: cmdPath
				}
			},
			...require(cmdPath)
		};
		for (const childCmdPath of newCmd.childs) {
			newCmd._.childs.push(
				await this.loadCommand(
					path.resolve(require.resolve(cmdPath), '..', childCmdPath)
				)
			);
		}
		return newCmd;
	}
};
