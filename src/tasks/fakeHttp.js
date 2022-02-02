import http from "http"

export default function(port) {
	return {
		description: "Create fake http server on port: " + port,
		async fn() {
			const server = http.createServer((req, res) => {
				res.writeHead(200, "OK", {
					"Content-Type": "text/plain"
				})
				res.write(
					"This is just a dummy HTTP server to fool heroku, replit, ..."
				)
				res.end()
			})
			await server.listen(port || 0, "0.0.0.0")
			return server
		}
	}
}
