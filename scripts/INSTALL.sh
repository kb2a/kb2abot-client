echo "Bat dau setup . . ."
case "$1" in
    "--os=windows")
        echo "Cai dat node_modules . . ."
        npm install ;;
    "--os=android")
        echo "Cai dat cURL . . ."
        apt install -y curl
        echo "Cai dat Node.js, npm, git . . ."
        curl -sL https://deb.nodesource.com/setup_15.x | bash -
        apt install -y nodejs
        apt install -y git
        echo "Cai dat kb2abot-cli . . ."
        npm i kb2abot-cli@latest -g
        kb2abot-cli clone ;;
esac
echo "Da tai xong!"