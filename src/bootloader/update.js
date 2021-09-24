import fs from "fs"
import axios from "axios"
const packageJSON = JSON.parse(fs.readFileSync("../../package.json"))

module.exports = {
	des: "Checking update for susbot",
	modes: ["production"],
	async fn() {
		const {data: remotePackage} = await axios.get(
			"https://raw.githubusercontent.com/kb2ateam/kb2abot/main/package.json"
		)
		if (remotePackage.version != packageJSON.version) {
			const {data: info} = await axios.get(
				"https://api.github.com/repos/kb2ateam/kb2abot/git/refs/heads/main"
			)
			const {data: commit} = await axios.get(info.object.url)
			console.log()
			console.newLogger.debug(
				`We have a new version: ${remotePackage.version}, current: ${packageJSON.version}, Use "npm run update" to update!`
			)
			console.newLogger.debug(`News: ${commit.message}`)
		}
	}
}
