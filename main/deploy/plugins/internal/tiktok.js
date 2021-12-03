const { getVideoMeta } = require('tiktok-scraper')
module.exports = {
    keywords: ['tiktok'],
    name: 'Lấy link video Tiktok',
    description: 'Lấy link của bất kì video Tiktok nào (có watermark)',
    guide: '<url>',
    childs: [],
    permission: {
        '*': '*',
    },
    datastoreDesign: {
        account: {
            global: {},
            local: {},
        },
        thread: {
            global: {},
            local: {},
        },
    },
    async onLoad() {},
    hookType: 'none',
    async onMessage(message, reply) {},
    async onCall(message, reply) {
        const url = kb2abot.helpers.getParam(message.body)
        if (!url) reply('Chưa nhập URL.')
        try {
            const videoMeta = await getVideoMeta(url.toString(), {})
            reply(
                `Link của video này là: ${
                    videoMeta.collector[0].videoUrlNoWaterMark.length
                        ? videoMeta.collector[0].videoUrlNoWaterMark
                        : videoMeta.collector[0].videoUrl
                }`
            )
        } catch {
            reply('Lỗi phát sinh trong quá trình lấy link.')
        }
    },
}
