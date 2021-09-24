import checkInternetConnected from "check-internet-connected"

export default {
	des: "Checking internet connection",
	modes: ["production"],
	async fn() {
		try {
			await checkInternetConnected({
				timeout: 5000, //timeout connecting to each server, each try
				retries: 5, //number of retries to do before failing
				domain: "https://github.com" //the domain to check DNS record of
			})
		} catch (e) {
			throw `Please check your internet, error: (${e.message})`
		}
	}
}
