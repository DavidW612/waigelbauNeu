# waigelbau.de – Website Waigel-Baukoordination

Statische Website (HTML/CSS/JS, kein Framework, kein CMS).

## Struktur
- `*.html` – fertige Seiten (werden aus `_build/` erzeugt – nicht direkt bearbeiten)
- `assets/` – CSS, JS, Schriften (lokal, DSGVO-freundlich), Logos
- `_build/pages/` – Inhalte der einzelnen Seiten
- `_build/partials/` – gemeinsamer Kopf, Navigation, Footer

## Seiten neu bauen
```
python3 _build/build.py
```

## Vor dem Livegang
- [ ] Alle Foto-Platzhalter durch echte Fotos ersetzen
- [ ] Hinweis „Entwurf · Fotos sind Platzhalter“ in `_build/partials/header.html` entfernen
- [ ] Impressum und Datenschutz vervollständigen (gelb markierte Stellen)
- [ ] Formular-Endpunkt in `_build/pages/kontakt.html` (`data-endpoint`) eintragen
- [ ] Investoren-Seite rechtlich prüfen lassen
