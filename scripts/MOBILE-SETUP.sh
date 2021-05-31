echo "Bash setup cho mobile setup (by khoakomlem)"
echo "Cai dat cURL . . ."
apt install -y curl
echo "Cai dat nodejs, npm, git . . ."
curl -sL https://deb.nodesource.com/setup_15.x | bash -
apt install -y nodejs
apt install -y git
echo "Cai dat kb2abot-cli . . ."
npm install kb2abot-cli@latest -g
kb2abot-cli clone
echo "Da tai xong!"
. ./kb2abot/scripts/INSTALL.sh
