const checkInternetConnected = require('check-internet-connected')
module.exports = {
    des: 'Kiem tra ket noi Internet',
    fn: async () => {
        const config = {
            timeout: 5000, //timeout connecting to each server, each try
            retries: 5, //number of retries to do before failing
            domain: 'https://www.google.com', //the domain to check DNS record of
        }
        try {
            await checkInternetConnected(config)
        } catch {
            throw new Error('Vui long kiem tra lai ket noi Internet!')
        }
    },
}
