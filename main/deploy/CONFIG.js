const path = require('path')
module.exports = {
    DEFAULT_THREAD_PREFIX: '/', // prefix mặc định cho mỗi box mới
    DIR: {
        GAME: path.join(__dirname, 'games'),
        PLUGIN: path.join(__dirname, 'plugins'),
        DATSTORE: path.join(__dirname, 'datastores'),
        SCHEMA: path.join(__dirname, 'schemas'),
        HELPER: path.join(__dirname, 'helpers'),
        UPDATE: path.join(__dirname, 'updates'),
    },
    INTERVAL: {
        SAVE_DATASTORE: 5 * 1000,
        CHECK_UPDATE: 3 * 60 * 60 * 1000,
        AUTO_ACCEPT_REQUEST: 10 * 1000,
        QUEUE_MESSAGE: 1000,
    },
    PRETTY_DATASTORE: false, // enable may cause to its performance (adding tab characters to datastore)
    SUPER_ADMINS: [
        // 'super admin' có permission hơn cả admin, thường là những người điều khiển bot
        // Những người này có quyền được sử dụng 1 số lệnh nguy hiểm (như reload, update, ...)
        // Bạn có thể lên trang: findidfb.com hoặc lookup-id.com để lấy ID Facebook
        '100007723935647',
    ],
    REFRESH_ADMINIDS: false,
    // Bật cái này để làm mới lại list admin mỗi khi tin nhắn đến (còn không thì phải restart bot thì nó mới làm mới lại list)
    // Những bạn nào có acc khỏe hoặc số lượng box hoạt động nhỏ (<10) thì mới nên bật
    FCA_OPTIONS: {
        logLevel: 'silent', // logger đăng nhập fb ("silly", "verbose", "info", "http", "warn", "error", or "silent")
        selfListen: false, // KHÔNG NÊN BẬT KHI SỬ DỤNG PLUGIN CÓ HOOK NHƯ AUTOREPLY (VÒNG LẶP -> SPAM)
        forceLogin: true, // Tự động accept location lạ khi login
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
        // Khi userAgent truyền vào không hợp lệ, bot sẽ không nhận được tin nhắn gì hết
        // Mặc định: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18
        // Cái userAgent này lạ lắm, mình test thử chrome & firefox thì thấy hoạt động trên mỗi chrome :/
        // Lưu ý khi bỏ userAgent vào thì nhớ tìm xóa "Chrome/xx.x.xxxx.xx" (kế cuối), mình ko hiểu tại sao nhưng làm vậy nó mới hoạt động :)
        autoMarkDelivery: true, // Đánh dấu là đã nhận
        autoMarkRead: true, // Đánh dấu là đã đọc
    },
}
