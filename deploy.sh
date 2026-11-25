#!/bin/bash
# ./deploy.sh temp2   or   ./deploy.sh live     (files get a version no cache has seen; index.html goes up last)
set -e; cd "$(dirname "$0")"; T="${1:-temp2}"; [ "$T" = live ] && R=site U=https://jashparmar.com/ || { R=temp2; U=https://jashparmar.com/temp2/; }
V="zoom$(date +%y%m%d%H%M%S)"; D=$(mktemp -d); chmod 755 "$D"; cp -R index.html z "$D"/
sed -i '' -E "s/(\.(js|css|json|svg|png))\?v=[a-z0-9]+/\1?v=$V/g" "$D"/index.html "$D"/z/app.js "$D"/z/worlds.js "$D"/z/cats.js
sed -i '' -E "s/(vendor\/three.module.min.js)/\1?v=170/" "$D"/index.html
sed -i '' -E "s/(z\/img\/[a-z0-9-]+\.webp)/\1?v=$V/g" "$D"/z/content.js
(cd "$D" && COPYFILE_DISABLE=1 tar --no-xattrs -cf - z) | ssh JASHPARMAR "tar xf - -C ~/public_html/$R"; ssh JASHPARMAR "cat > ~/public_html/$R/index.html" < "$D/index.html"
for f in index.html "z/app.js?v=$V" "z/ink.js?v=$V" "z/worlds.js?v=$V" "z/cats.js?v=$V" "z/content.js?v=$V" "z/style.css?v=$V" "z/land.json?v=$V" "z/vendor/three.module.min.js?v=170" "z/img/drishi.webp?v=$V"; do a=$(curl -s "$U${f/index.html/}" | shasum | cut -c1-8); b=$(shasum "$D/${f%%\?*}" | cut -c1-8); [ "$a" = "$b" ] && echo "ok $f" || echo "MISMATCH $f $a $b"; done; rm -rf "$D"
