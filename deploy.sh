#!/bin/bash
# ./deploy.sh temp2   or   ./deploy.sh live     (files get a version no cache has seen; pages go up last)
set -e; cd "$(dirname "$0")"; python3 pages/make.py; T="${1:-temp2}"; [ "$T" = live ] && R=site U=https://jashparmar.com/ || { R=temp2; U=https://jashparmar.com/temp2/; }
V="zoom$(date +%y%m%d%H%M%S)"; D=$(mktemp -d); chmod 755 "$D"; cp -R *.html z "$D"/
sed -i '' -E "s/(\.(js|css|json|svg|png|jpg|webp))\?v=[a-z0-9]+/\1?v=$V/g" "$D"/*.html "$D"/z/*.js
sed -i '' -E "s/(vendor\/three.module.min.js)/\1?v=170/" "$D"/*.html
sed -i '' -E "s/(z\/img\/[a-z0-9-]+\.webp)/\1?v=$V/g" "$D"/z/content.js
(cd "$D" && COPYFILE_DISABLE=1 tar --no-xattrs -cf - z) | ssh JASHPARMAR "tar xf - -C ~/public_html/$R"; (cd "$D" && COPYFILE_DISABLE=1 tar --no-xattrs -cf - *.html) | ssh JASHPARMAR "tar xf - -C ~/public_html/$R"
# index.html always differs: Cloudflare strips the email_off comments
for f in index.html cats print name $(cd "$D" && ls z/*.js z/*.css z/*.json | sed "s/$/?v=$V/") "z/vendor/three.module.min.js?v=170" "z/img/drishi.webp?v=$V"; do p="${f%%\?*}"; case "$p" in cats|print|name) p="$p.html";; esac; a=$(curl -s "$U${f/index.html/}" | shasum | cut -c1-8); b=$(shasum "$D/$p" | cut -c1-8); [ "$a" = "$b" ] && echo "ok $f" || echo "MISMATCH $f"; done; rm -rf "$D"
