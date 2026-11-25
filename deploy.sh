#!/bin/bash
# Uploads to /temp2 with a version no browser or edge cache has seen before.
set -e; cd "$(dirname "$0")"; V="zoom$(date +%y%m%d%H%M%S)"; D=$(mktemp -d); chmod 755 "$D"
cp -R index.html style.css app.js ink.js worlds.js content.js land.json favicon.svg img "$D"/
sed -i '' -E "s/(\.(js|css|json))\?v=[a-z0-9]+/\1?v=$V/g" "$D"/index.html "$D"/app.js "$D"/worlds.js
sed -i '' -E "s/(img\/[a-z0-9-]+\.webp)/\1?v=$V/g" "$D"/content.js
(cd "$D" && COPYFILE_DISABLE=1 tar --no-xattrs -cf - .) | ssh JASHPARMAR 'mkdir -p ~/public_html/temp2 && cp ~/public_html/temp/.htaccess ~/public_html/temp2/ && tar xf - -C ~/public_html/temp2'
for f in index.html "app.js?v=$V" "ink.js?v=$V" "worlds.js?v=$V" "content.js?v=$V" "style.css?v=$V" "land.json?v=$V"; do a=$(curl -s "https://jashparmar.com/temp2/${f/index.html/}" | shasum | cut -c1-8); b=$(shasum "$D/${f%%\?*}" | cut -c1-8); [ "$a" = "$b" ] && echo "ok $f" || echo "MISMATCH $f $a $b"; done; rm -rf "$D"
