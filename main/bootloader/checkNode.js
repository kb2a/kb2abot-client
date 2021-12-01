const semver = require('semver')
module.exports = {
    des: 'Kiem tra phien ban Nodejs',
    fn: async () => {
        const nodeVersion = semver.parse(process.version)
        if (nodeVersion.major < 14)
            throw new Error(
                `ERROR: Node.js 14+ is required to run this! (current: "${process.version}")`
            )
    },
}
