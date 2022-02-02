import fs from "fs"
import fetch from "node-fetch"
import Table from "cli-table3"
import semver from "semver"

const OUTDATED = -1 // enum

export default function() {
	const table = new Table({
		head: ["Version", "What's new"],
		colWidths: [widthByPercent(0.15), widthByPercent(0.7)],
		wordWrap: true
	})

	return {
		description: "Check update for kb2abot core",
		async fn() {
			// const localPackage = JSON.parse(fs.readFileSync(process.cwd() + "/node_modules/kb2abot/package.json"))
			const localPackage = JSON.parse(
				fs.readFileSync(process.cwd() + "/../kb2abot/package.json")
			)
			const localRelease = await json(
				"https://api.github.com/repos/kb2ateam/kb2abot/releases/tags" +
					localPackage.version
			)
			const releases = await json(
				"https://api.github.com/repos/kb2ateam/kb2abot/tags"
			)

			if (
				releases.length > 0 &&
				semver.compare(localPackage.version, releases[0].name) == OUTDATED
			) {
				table.push([
					localPackage.version + " (current)",
					localRelease.body || "404 NOT FOUND"
				])
				let count = 0
				for (const release of releases) {
					const {body} = await json(
						"https://api.github.com/repos/kb2ateam/kb2abot/releases/tags/" +
							release.name
					)
					if (!body) continue
					const content = [release.name, body.replace(/\r/g, "")]
					semver.compare(localPackage.version, release.name) == OUTDATED
						? table.unshift(content)
						: table.push(content)
					if (++count >= 4) break
				}
				console.log(
					`New version ${releases[0].name}, current: ${localPackage.version}`
				)
				console.log(table.toString())
			} else {
				console.log("You're using the newest kb2abot-core version!")
			}
		}
	}
}

function widthByPercent(percent) {
	return Math.ceil(process.stdout.columns * percent)
}

async function json(url) {
	return await (await fetch(url)).json()
}
