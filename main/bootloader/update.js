const axios = require('axios')
const { version } = require('../../package.json')
module.exports = {
    des: 'Kiem tra va cap nhat kb2abot',
    fn: async () => {
        const { data } = await axios.get(
            'https://raw.githubusercontent.com/kb2ateam/kb2abot/main/package.json'
        )
        const { data: info } = await axios.get(
            'https://api.github.com/repos/kb2ateam/kb2abot/git/refs/heads/main'
        )
        const { data: commit } = await axios.get(info.object.url)
        if (data.version !== version) {
            const isNewerVersion = (oldVer, newVer) => {
                const oldParts = oldVer.split('.')
                const newParts = newVer.split('.')
                for (let i = 0; i < newParts.length; i++) {
                    const a = ~~newParts[i]
                    const b = ~~oldParts[i]
                    if (a > b) return true
                    if (a < b) return false
                }
                return false
            }
            console.log()
            if (!isNewerVersion(data.version.toString(), version.toString()))
                console.newLogger.debug(
                    `Da co phien ban moi: ${data.version}, phien ban hien tai: ${version}\nNoi dung update: ${commit.message}`
                )
            else
                console.newLogger.debug(
                    'Ban dang phat trien mot phien ban moi hon chang?'
                )
        }
    },
}
