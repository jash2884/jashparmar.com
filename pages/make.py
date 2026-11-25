# builds the shells of the explore pages
P = {'cats': ('Cat room', 'A room full of cats. Laser, yarn, treats and cardboard boxes.', '#8f5bff', 'catroom.js'), 'print': ('Print shop', 'Turn any photo into a comic print in your browser. Nothing is uploaded.', '#ffd52e', 'print.js'), 'name': ('Your name in print', 'Type your name and get it as big 3D comic letters.', '#12c26b', 'name.js')}
HEAD = '''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>@T | Jash Parmar</title>
<meta name="description" content="@D" /><meta name="robots" content="index, follow" /><link rel="canonical" href="https://jashparmar.com/@K" />
<meta property="og:type" content="website" /><meta property="og:title" content="@T" /><meta property="og:description" content="@D" /><meta property="og:url" content="https://jashparmar.com/@K" /><meta property="og:image" content="https://jashparmar.com/z/og-@K.jpg?v=1" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://jashparmar.com/z/og-@K.jpg?v=1" />
<meta name="theme-color" content="@C" /><link rel="icon" href="z/icon.svg?v=1" type="image/svg+xml" /><link rel="apple-touch-icon" href="z/icon-180.png?v=1" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Figtree:wght@400..800&display=swap" rel="stylesheet" />
<script type="importmap">{"imports":{"three":"./z/vendor/three.module.min.js","three/addons/":"./z/vendor/addons/"}}</script>
<link rel="stylesheet" href="z/pages.css?v=1" />
</head><body style="--paper:@C" class="@B">
<header><a href="./">Jash Parmar</a><nav aria-label="Explore">@N</nav></header>
@M
<p id="say" role="status"></p>
<script type="module" src="z/@J?v=1"></script>
</body></html>
'''
for k, (t, d, c, j) in P.items():
    nav = ''
    for n, l in (('./', 'Home'), ('cats', 'Cats'), ('print', 'Print'), ('name', 'Name')):
        nav += '<a href="%s"%s>%s</a>' % (n, ' aria-current="page"' if n == k else '', l)
    h = HEAD
    for a, b in (('@T', t), ('@D', d), ('@K', k), ('@C', c), ('@B', 'scroll' if k == 'print' else 'full'), ('@N', nav), ('@M', open('pages/body-%s.html' % k).read()), ('@J', j)):
        h = h.replace(a, b)
    open(k + '.html', 'w').write(h)
