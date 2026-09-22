#!/usr/bin/env python3
"""Erzeugt eine einzige, klickbare Vorschau-Datei mit allen Seiten
(Schriften, Logos, CSS und JS eingebettet). Nur für die Vorschau im Chat –
auf den Server kommen die normalen HTML-Dateien."""
import base64, re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/outputs/waigelbau-vorschau.html")
PAGES = ["index", "leistungen", "referenzen", "projektentwicklung", "ueber-uns", "kontakt", "impressum", "datenschutz"]


def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode((ROOT / path).read_bytes()).decode()


css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")
css = css.replace('url("../fonts/archivo.woff2")', f'url("{b64("assets/fonts/archivo.woff2", "font/woff2")}")')
css = css.replace('url("../fonts/inter.woff2")', f'url("{b64("assets/fonts/inter.woff2", "font/woff2")}")')
css += "\n.spa-page{display:none}.spa-page.is-active{display:block}\n"
js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")

index = (ROOT / "index.html").read_text(encoding="utf-8")
head = index[: index.index('<main id="main">')]
tail = index[index.index("</main>"):]
head = re.sub(r'\s*<link rel="preload"[^>]+>', "", head)
head = head.replace('<link rel="stylesheet" href="assets/css/style.css">', f"<style>{css}</style>")
head = head.replace("<title>", "<title>Vorschau · ")
tail = tail.replace('<script src="assets/js/main.js" defer></script>', "__SCRIPTS__")

parts = []
for name in PAGES:
    src = (ROOT / f"{name}.html").read_text(encoding="utf-8")
    body = src[src.index('<main id="main">') + len('<main id="main">'): src.index("</main>")]
    title = re.search(r"<title>(.*?)</title>", src).group(1)
    active = " is-active" if name == "index" else ""
    parts.append(f'<div class="spa-page{active}" data-page="{name}" data-title="{title}">{body}</div>')

router = r"""
<script>
(function(){
  var pages = document.querySelectorAll('.spa-page');
  function show(name, hash, query){
    var target = document.querySelector('.spa-page[data-page="'+name+'"]');
    if(!target) return false;
    pages.forEach(function(p){ p.classList.toggle('is-active', p===target); });
    document.title = 'Vorschau · ' + target.getAttribute('data-title');
    document.querySelectorAll('.nav__links a').forEach(function(a){
      var h=(a.getAttribute('href')||'').split(/[#?]/)[0];
      if(h===name+'.html' && !a.classList.contains('btn')) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.body.classList.remove('menu-open');
    if(query){ var m=query.match(/thema=([a-z]+)/); if(m){ var r=target.querySelector('input[name="projektart"][value="'+m[1]+'"]'); if(r) r.checked=true; } }
    var el = hash && target.querySelector(hash);
    var html=document.documentElement, prev=html.style.scrollBehavior; html.style.scrollBehavior='auto';
    if(el){ requestAnimationFrame(function(){ window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80); }); }
    else window.scrollTo(0,0);
    html.style.scrollBehavior=prev;
    window.dispatchEvent(new Event('scroll'));
    return true;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]'); if(!a) return;
    var href = a.getAttribute('href');
    var m = href.match(/^([a-z0-9-]+)\.html(\?[^#]*)?(#.*)?$/i);
    if(m){ e.preventDefault(); show(m[1], m[3], m[2]); }
  });
})();
</script>"""

html = head + '<main id="main">' + "\n".join(parts) + tail.replace("__SCRIPTS__", f"<script>{js}</script>{router}")
html = html.replace("assets/logo-hell.webp", b64("assets/logo-hell.webp", "image/webp"))
html = html.replace("assets/logo.webp", b64("assets/logo.webp", "image/webp"))
html = html.replace("assets/favicon.svg", b64("assets/favicon.svg", "image/svg+xml"))
html = html.replace("Entwurf · Fotos sind Platzhalter", "Vorschau · Fotos sind Platzhalter")
OUT.write_text(html, encoding="utf-8")
print(OUT, len(html) // 1024, "KB")
