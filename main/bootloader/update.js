const git = require("simple-git")();
const installChanged = require("install-changed");

module.exports = {
	des: "Kiem tra va cap nhat kb2abot",
	fn: async () => {
		const initResult = await git.init();
		if (!initResult.existing) {
			await git.addRemote("origin", "https://github.com/kb2ateam/kb2abot");
		}

		await git.fetch("origin", "main"); //git fetch origin main
		await git.reset(["origin/main", "--hard"]); //git reset origin/main --hard
		installChanged.watchPackage();
	}
};
