# Projekt: Website Waigel-Baukoordination (waigelbau.de)

Firmenwebsite für Waigel-Baukoordination (immer mit Bindestrich), Inhaber Eugen Waigel.
Fritz-Reuter-Str. 16, 29633 Munster · +49 172 9502318 · info@waigelbau.de
Betreut von David (Bruder). Mit David immer auf Deutsch kommunizieren. Sprache der Seite: Deutsch, Sie-Form, professionell aber nahbar, keine leeren Floskeln.

## Technik
- Statisches HTML/CSS/JS, kein Framework, kein CMS.
- Seiten NICHT direkt in den *.html im Hauptordner bearbeiten – die werden erzeugt.
  Inhalte liegen in `_build/pages/*.html`, gemeinsamer Kopf/Menü/Footer in `_build/partials/`.
  Nach jeder Änderung: `python3 _build/build.py` (bzw. `python _build/build.py` unter Windows).
- `_build/preview.py` erzeugt eine einzelne Vorschau-Datei mit allen Seiten (nur zum Anschauen).
- Styles: `assets/css/style.css` (Farben als Variablen in `:root`), Interaktionen: `assets/js/main.js`.
- Schriften (Archivo, Inter) liegen lokal in `assets/fonts` – bewusst kein Google Fonts (DSGVO).
- Keine Cookies, kein Tracking.

## Design
- Anthrazit/Beton/Sand + Logo-Blau (#0b4ea2) als Akzent. Logos: `assets/logo.webp` (dunkel), `assets/logo-hell.webp` (hell).
- Animationen: Scroll-Reveal per IntersectionObserver, hochzählende Zahlen, Sticky-Navigation,
  Parallax im Hero, Kran/Rohbau-Zeichnung im Hero (rein dekorativ, ohne Maße/Beschriftung).
- Mobile-first. Nach jeder Änderung auf Handybreite (320–414 px) prüfen: kein seitliches Scrollen,
  Tap-Flächen groß genug. Hover-Effekte nur für Maus (`@media (hover: hover/none)`).

## Inhaltliche Regeln
- Nie von Subunternehmern sprechen. Aber auch nichts behaupten, was nicht belegt ist
  (z. B. keine Zahlen zu Mitarbeitern oder Maschinen).
- Maschinen nur allgemein: „eigene Baumaschinen“ / „eigener Maschinenpark“ – keine Anzahl, keine Typen.
- Einsatzgebiet: Heidekreis, Landkreis Celle, ganz Niedersachsen, größere Projekte auch überregional.
- Referenz Celle (Rohbau Mehrfamilienhaus, 6 WE) war ein KLEINER Auftrag – nie als Hauptreferenz
  herausstellen, nicht auf der Startseite, nicht in Kennzahlen. Größere Projekte folgen noch.
- Zwei Zielgruppen sauber trennen: Bauherren/Bauträger (Neubau, Sanierung) vs. Investoren
  (Projektentwicklung Ukraine, eigene Seite `projektentwicklung.html`, auf der Startseite nur dezenter Hinweis).
- Investoren-Seite: keine Renditeversprechen; der Hinweis „kein öffentliches Angebot“ bleibt drin.

## Offen vor dem Livegang
- Fotos: alle Platzhalter (gelb „Foto-Platzhalter“) durch echte Baustellenfotos ersetzen.
- Gelb markierte `<span class="todo">`-Stellen füllen (Projekte, Impressum, Zitat, Datenschutz).
- Hinweis „Entwurf · Fotos sind Platzhalter“ in `_build/partials/header.html` entfernen.
- Hosting: IONOS-Webspace. GitHub Action `.github/workflows/deploy-ionos.yml` : Push auf main = nur Verbindungstest, KEIN Upload. Live-Upload nur manuell (Actions → Run workflow → Modus „live“) – Seite darf erst nach Freigabe durch David live gehen! Noch
  Formular-Endpunkt in `_build/pages/kontakt.html` (`data-endpoint`) eintragen.
- Impressum: Betreiber/Rechtsform, USt-IdNr., ggf. Handwerkskammer ergänzen.

## Arbeitsweise
- Jede Änderung als eigener Commit mit kurzer deutscher Beschreibung, danach pushen
  (Remote: https://github.com/DavidW612/waigelbauNeu.git, Branch main).
