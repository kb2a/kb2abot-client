/**
 * Màu mè, hoa lá cho terminal<br>
 * Hướng dẫn sử dụng:<br>
 * <code>import {Logger, initLogger} from "./console.util.js";</code>
 * @module CONSOLE
 */
import chalk from 'chalk';

export class Logger {
	constructor(prefixTag = 'KB2ABOT') {
		this.prefixTag = prefixTag;
		this.chalk = new chalk.Instance();
	}

	getPrefix(tags) {
		const newTags = [this.prefixTag];
		if (Array.isArray(tags)) {
			for (const tag of tags) {
				newTags.push(tag);
			}
		} else {
			if (tags) newTags.push(tags);
		}
		let prefix = chalk.white.bgBlack(`[${newTags[0]}]`) + ' ';
		for (let i = 1; i < newTags.length; i++) {
			prefix += `[${newTags[i]}] `;
		}
		return prefix;
	}

	log(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(prefix + msg);
	}

	debug(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(prefix + chalk.white.bgCyan('[DEBUG]') + ' ' + chalk.cyan(msg));
	}

	error(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(prefix + chalk.white.bgRed('[ERROR]') + ' ' + chalk.red(msg));
	}

	done(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(
			prefix + chalk.white.bgGreen('[DONE]') + ' ' + chalk.green(msg)
		);
	}

	success(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(
			prefix + chalk.white.bgGreen('[SUCCESS]') + ' ' + chalk.green(msg)
		);
	}

	warn(msg, tags) {
		const prefix = this.getPrefix(tags);
		console.log(
			prefix + chalk.white.bgYellow('[WARN]') + ' ' + chalk.yellow(msg)
		);
	}
}

export const initLogger = (prefix, prop = 'newLogger') => {
	console[prop] = new Logger(prefix);
};

export const setTerminalTitle = text => {
	process.stdout.write(
		`${String.fromCharCode(27)}]0;${text}${String.fromCharCode(7)}`
	);
};