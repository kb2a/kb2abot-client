import http from "http"

module.exports = {
	des: "Creating fake http server",
	modes: ["production"],
	async fn() {
		const server = http.createServer((req, res) => {
			res.writeHead(200, "OK", {
				"Content-Type": "text/plain"
			})
			res.write("This is just a dummy HTTP server to fool Heroku.")
			res.end()
		})
		await server.listen(process.env.PORT || 0, "0.0.0.0")
	}
}
