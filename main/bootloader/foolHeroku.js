const http = require('http')
module.exports = {
    des: 'Tao server HTTP gia cho Heroku',
    fn: () => {
        const server = http.createServer((req, res) => {
            res.writeHead(200, 'OK', {
                'Content-Type': 'text/plain',
            })
            res.write('This is just a dummy HTTP server to fool Heroku.')
            res.end()
        })
        server.listen(process.env.PORT || 0, '0.0.0.0')
    },
}
