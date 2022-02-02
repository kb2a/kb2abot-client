import serverline from "serverline"

const completions = []
const commands = {}

export const addCompletion = completion => {
	completions.push(completion)
	serverline.setCompletion(completions)
}

export const removeCompletion = completion => {
	const index = completions.findIndex(c => c == completion)
	if (index != -1) completions.splice(index, 1)

	serverline.setCompletion(completions)
}

export const registerCommand = (keyword, cmd) => {
	commands[keyword] = cmd
}

export const init = (prefix = ">") => {
	serverline.init()
	serverline.setPrompt(prefix)
	serverline.on("line", function(line) {
		// switch (line) {
		// case "help":
		// console.log("help: To get this message.")
		// break
		// case "pwd":
		// console.log("toggle muted", !serverline.isMuted())
		// serverline.setMuted(!serverline.isMuted(), "> [hidden]")
		// return true
		// case "secret":
		// serverline.secret("secret:", function () {
		// console.log(";)")
		// })
		// break
		// }
		const keyword = line.split(" ")[0]
		if (commands[keyword]) {
			console.log(`Executing ${line} xD`)
			commands[keyword].onCall()
		} else {
			console.log(
				`"${line}" is not recognized as an internal or external command`
			)
		}

		if (serverline.isMuted()) serverline.setMuted(false)
	})

	serverline.on("SIGINT", function(rl) {
		rl.question("Shutdown bot? [Y/n]: ", answer =>
			answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write("\x1B[1K> ")
		)
	})
}
