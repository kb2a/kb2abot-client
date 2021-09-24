import {execSync} from "child_process"
import axios from "axios"

module.exports = {
	des: "Checking update for susbot-cli",
	modes: ["production"],
	async fn() {
		const {data: remotePackage} = await axios.get(
			"https://raw.githubusercontent.com/sus-bot/susbot-cli/main/package.json"
		)
		let currentVersion
		try {
			currentVersion = execSync("susbot-cli -v")
		} catch (e) {
			currentVersion = 0
		}
		if (currentVersion != remotePackage.version) {
			await remotePackage("npm i susbot-cli@latest -g")
		}
	}
}
