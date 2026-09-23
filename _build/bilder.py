#!/usr/bin/env python3
"""Bereitet die Fotos aus assets/bilder/ für die Website auf.

Aufruf:  python _build/bilder.py

Aus jedem Original entstehen zugeschnittene WebP-Dateien in assets/img/ –
je eine große Fassung für den Rechner und eine kleine fürs Handy. Die
Originale bleiben unangetastet und werden nicht mit hochgeladen.

Neue Fotos einbinden: unten in BILDER eintragen und das Skript neu laufen lassen.
  quelle    Dateiname in assets/bilder/
  name      Dateiname ohne Endung in assets/img/
  format    Seitenverhältnis: "quer" 16:10, "breit" 16:9, "hoch" 4:5, "kasten" 4:3
  fokus     Bildausschnitt: 0.0 = oben/links, 0.5 = Mitte, 1.0 = unten/rechts
  zoom      optional, 1.0 = ganzes Bild, 1.2 = 20 % näher heran
"""
import pathlib
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
QUELLE = ROOT / "assets" / "bilder"
ZIEL = ROOT / "assets" / "img"

SEITEN = {"quer": 16 / 10, "breit": 16 / 9, "hoch": 4 / 5, "kasten": 4 / 3}
BREITEN = {"gross": 1400, "klein": 700}
QUALITAET = 80

BILDER = [
    {"quelle": "Neubau 2 Soltau.jpeg", "name": "neubau-rohbau", "format": "quer", "fokus": 0.45},
    {"quelle": "Neubau 2 Soltau.jpeg", "name": "neubau-rohbau-hoch", "format": "hoch", "fokus": 0.5},
    {"quelle": "Sanierung.jpeg", "name": "sanierung-kran", "format": "quer", "fokus": 0.5},
    {"quelle": "Sanierung 3.jpeg", "name": "sanierung-element-hoch", "format": "hoch", "fokus": 0.35},
    {"quelle": "Sanierung 2.jpeg", "name": "bodenplatte", "format": "kasten", "fokus": 0.55},
    {"quelle": "Neubau Munster.jpeg", "name": "neubau-munster", "format": "kasten", "fokus": 0.42, "zoom": 1.18},
    {"quelle": "Neubau Munster.jpeg", "name": "neubau-munster-breit", "format": "breit", "fokus": 0.45, "zoom": 1.15},
    {"quelle": "Sanierung.jpeg", "name": "sanierung-kran-kasten", "format": "kasten", "fokus": 0.5},
]


def heranholen(bild, zoom):
    """Schneidet mittig einen Ausschnitt heraus – gegen störende Ränder."""
    if zoom <= 1:
        return bild
    b, h = bild.size
    nb, nh = int(b / zoom), int(h / zoom)
    return bild.crop(((b - nb) // 2, (h - nh) // 2, (b - nb) // 2 + nb, (h - nh) // 2 + nh))


def zuschneiden(bild, verhaeltnis, fokus):
    """Schneidet mittig auf das Zielverhältnis zu, verschoben nach fokus."""
    b, h = bild.size
    if b / h > verhaeltnis:                      # zu breit -> links/rechts kappen
        neu_b = int(h * verhaeltnis)
        links = int((b - neu_b) * fokus)
        return bild.crop((links, 0, links + neu_b, h))
    neu_h = int(b / verhaeltnis)                 # zu hoch -> oben/unten kappen
    oben = int((h - neu_h) * fokus)
    return bild.crop((0, oben, b, oben + neu_h))


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    for eintrag in BILDER:
        pfad = QUELLE / eintrag["quelle"]
        if not pfad.exists():
            print("fehlt:", eintrag["quelle"])
            continue
        bild = ImageOps.exif_transpose(Image.open(pfad)).convert("RGB")
        bild = heranholen(bild, eintrag.get("zoom", 1.0))
        bild = zuschneiden(bild, SEITEN[eintrag["format"]], eintrag["fokus"])
        for kennung, breite in BREITEN.items():
            if bild.width < breite:
                breite = bild.width
            hoehe = round(breite * bild.height / bild.width)
            klein = bild.resize((breite, hoehe), Image.LANCZOS)
            datei = ZIEL / f"{eintrag['name']}-{kennung}.webp"
            klein.save(datei, "WEBP", quality=QUALITAET, method=6)
            print(f"{datei.name:36} {breite}x{hoehe}  {datei.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    main()
