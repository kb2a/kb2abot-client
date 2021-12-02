const checkInternetConnected = require('check-internet-connected')
module.exports = {
    des: 'Kiem tra ket noi Internet',
    fn: async () => {
        const config = {
            timeout: 5000,
            retries: 5,
            domain: 'https://www.google.com',
        }
        try {
            await checkInternetConnected(config)
        } catch {
            throw new Error('Vui long kiem tra lai ket noi Internet!')
        }
    },
}
