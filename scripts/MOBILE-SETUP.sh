echo "Installing cURL"
apt install -y curl
echo "Installing nodejs 16, npm, git"
curl -sL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs
apt install -y git
echo "Install susbot-cli globally"
npm install susbot-cli@latest -g
susbot-cli clone
echo "Done, please run INSTALL.sh"
