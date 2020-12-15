
![GitHub All Releases](https://img.shields.io/github/downloads/kb2abot/kb2abot/total)

# KB2ABOT

Bot trang cá nhân facebook trả lời tự động.
##  GIỚI THIỆU
Đây đơn giản là một con bot tự động trả lời các tin nhắn, có thể sử dụng lệnh hay ho các thứ!
### PHẦN MỀM BẮT BUỘC
Bạn phải có trong máy hai phần mềm dưới để có thể chạy kb2abot
* [NodeJs](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads)

**Với điện thoại:**  (ứng dụng termux)
```
pkg install nodejs
```
```
pkg install git
```
### CÀI ĐẶT (chỉ làm một lần đầu)
<b>*Bạn phải làm bước này!</b>
```
npm install
```

### CẬP NHẬT
Mở cửa sổ command-prompt, **mount tới thư mục kb2abot** và gõ: 
```
npm start
```
Bot sẽ tự động kiểm tra các bản cập nhật và tải về, **nếu bị lỗi thì bạn phải xóa thư mục ".git" ở folder chính (nếu không thấy thư mục đó thì mở cmd, cd đến folder chính và gõ: rm -rf .git)**
<br>
**Hoặc bạn có thể tự tay cập nhật bằng cách gõ:** 
```
npm run update
```
## CHẠY BOT

### Bước 1: Tải cookie về /bots
**Nếu bạn đang xài máy tính:** 
Tải extension [J2TEAM Cookies](https://chrome.google.com/webstore/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco) về, sau đó bấm nút **export** trong tiện ích trên khi đang ở trang **facebook.com**.

**Nếu bạn đang xài điện thoại:**
Cài trình duyệt **Kiwi** trên CHPlay hay Appstore gì đó rồi lại tải extension [J2TEAM Cookies](https://chrome.google.com/webstore/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco) về và bấm nút **export** trong lúc  đang ở trang **m.facebook.com**. Hoặc bạn cũng có thể export cookie bằng máy rồi lưu ở chỗ nào đó sao cho điện thoại bạn có thể copy được đoạn cookie đó.
Sau khi bằng cách nào đó bạn copy hết được đoạn cookie trên, bạn cài vim trong termux:
```
pkg install termux
```
Sau đó mount vào /bots và tạo file cookie bằng vim:
```
cd bots
vim <tên gì đó>.json
```
Vim sẽ mở lên, bạn chỉ việc paste hết đoạn cookie nãy vào chỗ đó, sau đó **bấm ESC** (ở trên bàn phím) và gõ **:wq** để thoát vim và lưu lại (**:qa** để thoát và không lưu)
### Bước 2: Đổi tên cookie
Đổi tên file bạn mới tải về đó (facebookxxxxx.json) thành tên mà bạn muốn (vd: khoakomlem.json) và đặt vào thư mục /bots. 
**Note:** nếu có nhiều file cookie ở trong /bots thì bot sẽ hỏi bạn chọn những file nào để chạy bot thì bạn bấm **space để chọn** và **enter để xác nhận** nhé!
### Bước 3: Chạy bot
Chạy file **[WINDOW] START.bat** nếu máy bạn là window, **START.sh** nếu máy bạn không phải là window (hoặc cũng có thể chạy bot thông qua lệnh: **npm start**

# Thanks for using kb2abot ♥
