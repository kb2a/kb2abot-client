import semver from "semver"

export default {
	des: "Checking nodejs version",
	modes: ["production"],
	async fn() {
		const nodeVersion = semver.parse(process.version)
		if (nodeVersion.major < 14)
			throw `Node.js 12+ (>=14) is required to run this! (current: "${process.version}")`
	}
}
