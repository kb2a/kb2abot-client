const http = require('http');

module.exports = {
	des: 'Tao server http gia cho heroku',
	fn: async () => {
		const server = http.createServer((req, res) => {
			res.writeHead(200, 'OK', {
				'Content-Type': 'text/plain'
			});
			res.write('This is just a dummy HTTP server to fool Heroku.');
			res.end();
		});
		await server.listen(process.env.PORT || 0, '0.0.0.0');
	}
};
