echo "Chay clean-setup . . ."
case "$1" in
    "--mode=development")
        echo "Xoa thu muc node_modules . . ."
        rm -rf node_modules
        echo "Cai dat lai node_modules . . ."
        npm install ;;
    "--mode=production")
        echo "Xoa cac module khong can thiet trong thu muc node_modules . . ."
        npm prune --production ;;
esac
echo "Da xong!"