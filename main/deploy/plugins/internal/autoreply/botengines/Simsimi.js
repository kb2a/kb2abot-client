const axios = require('axios')
module.exports = async (message, reply) => {
    const res = await axios({
        url: `https://api.simsimi.net/v2/?text=${encodeURI(
            message.body
        )}&lc=vi`,
        method: 'GET',
    })
    reply(res.data.success)
}