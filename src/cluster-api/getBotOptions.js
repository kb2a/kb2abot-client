import fs from "fs"
import path from "path"
import hjson from "hjson"
import minimist from "minimist"

export default async function getBotOptions() {
	const args = minimist(process.argv.slice(2))
	if (!args.bot) throw new Error("Missing parameter --bot param")

	// deploy the bot
	const botPath = path.isAbsolute(args.bot)
		? args.bot
		: process.cwd() + "/bots/" + args.bot
	return hjson.parse(fs.readFileSync(botPath).toString())
}
