#!/usr/bin/env python3
"""Baut die statischen Seiten aus _build/pages/*.html + gemeinsamem Header/Footer.

Aufruf:  python3 _build/build.py
Jede Seiten-Datei beginnt mit einem Kopfblock:
<!--
title: Seitentitel
description: Meta-Beschreibung
nav: leistungen            (welcher Menüpunkt aktiv ist)
dark_nav: yes              (optional; Seiten, die mit dunklem Hero starten)
-->
"""
import os, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "_build" / "pages"
PARTS = ROOT / "_build" / "partials"

# Solange die Seite ein Entwurf ist: nicht von Suchmaschinen aufnehmen lassen.
# Vor dem Livegang auf "index, follow" stellen (und robots.txt anpassen).
ROBOTS_DEFAULT = "noindex, nofollow"

NAV = [
    ("leistungen", "leistungen.html", "Leistungen"),
    ("referenzen", "referenzen.html", "Referenzen"),
    ("ueber-uns", "ueber-uns.html", "Über uns"),
    ("kontakt", "kontakt.html", "Kontakt"),
]


def meta_block(src):
    m = re.match(r"\s*<!--(.*?)-->", src, re.S)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        src = src[m.end():]
    return meta, src


def nav_html(active):
    items = []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ""
        items.append(f'      <li><a href="{href}"{cur}>{label}</a></li>')
    cur = ' aria-current="page"' if active == "projektentwicklung" else ""
    items.append(f'      <li><a href="projektentwicklung.html" class="nav__invest"{cur}>Für Investoren</a></li>')
    items.append('      <li><a href="kontakt.html#anfrage" class="btn nav__cta">Projekt anfragen</a></li>')
    items.append('      <li class="nav__mobile-contact"><a href="tel:+491729502318">+49 172 9502318</a><a href="mailto:info@waigelbau.de">info@waigelbau.de</a></li>')
    return "\n".join(items)


def build():
    head = (PARTS / "head.html").read_text(encoding="utf-8")
    header = (PARTS / "header.html").read_text(encoding="utf-8")
    footer = (PARTS / "footer.html").read_text(encoding="utf-8")
    for f in sorted(PAGES.glob("*.html")):
        meta, body = meta_block(f.read_text(encoding="utf-8"))
        slug = f.stem
        canonical = "https://waigelbau.de/" + ("" if slug == "index" else f"{slug}.html")
        page = head.replace("{{title}}", meta.get("title", "Waigel-Baukoordination"))
        page = page.replace("{{description}}", meta.get("description", ""))
        page = page.replace("{{canonical}}", canonical)
        page = page.replace("{{robots}}", meta.get("robots", ROBOTS_DEFAULT))
        page += header.replace("{{nav}}", nav_html(meta.get("nav", "")))
        page += body.strip() + "\n"
        page += footer
        (ROOT / f"{slug}.html").write_text(page, encoding="utf-8")
        print("gebaut:", f"{slug}.html")


if __name__ == "__main__":
    build()
