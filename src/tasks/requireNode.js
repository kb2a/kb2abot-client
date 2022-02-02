import semver from "semver"

const OUTDATED = -1 // enum
export default function(version = 16) {
	return {
		description: `Check nodejs version (>=${version})`,
		async fn() {
			const nodeVersion = semver.parse(process.version)
			const requireVersion = semver.parse(version)
			if (semver.compare(nodeVersion, requireVersion) == OUTDATED)
				throw `Node.js ${version} is required to run this! (current: "${process.version}")`
		}
	}
}
