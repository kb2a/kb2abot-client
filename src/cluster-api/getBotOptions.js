import fs from "fs"
import url from "url"
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
	const parsed = hjson.parse(fs.readFileSync(botPath).toString())
	if (parsed.credential.cookie.includes("./")) {
		parsed.credential.cookie = fs.readFileSync(url.pathToFileURL(path.join(process.cwd(), "bots", parsed.credential.cookie))).toString()
	}
	return parsed
}
