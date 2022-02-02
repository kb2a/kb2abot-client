import ora from "ora"
import {error} from "kb2abot/util/logger"

export default class Bootloader {
	tasks = [];

	constructor({verbose = false} = {}) {
		this.verbose = verbose
	}

	use(task) {
		this.tasks.push(task)
	}

	async load() {
		if (this.verbose) {
			for (const task of this.tasks) {
				const spinner = ora(task.description).start()
				try {
					await task.fn()
				} catch (err) {
					spinner.fail()
					error(err)
				}
				spinner.succeed()
			}
		} else {
			for (const task of this.tasks) await task.fn()
		}
	}
}
