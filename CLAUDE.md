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
  Parallax im Hero. Startseite: isometrischer Rohbau, der sich Geschoss für Geschoss aufbaut.
  Unterseiten: gezeichnete Seitenansichten im Seitenkopf. Beide bewusst unterschiedlich halten.
  Zeichnungen starten erst, wenn sie im Bild sind (Klasse `is-drawing` aus main.js).
  Auf dem Handy laufen Animationen NIE hinter der Schrift – sie bekommen einen eigenen Streifen.
  Kein Scan-/Lichtschein-Effekt (von David abgelehnt).
  Fortschrittslinien (Ablauf, Zeitleiste) enden an der Mitte der letzten Zahl, nicht am Rand.
  Jede Seite hat eine Zeichnung im Kopf (auch Impressum/Datenschutz) – keine Seite ohne.
  ACHTUNG: `@keyframes draw` in style.css wird von ALLEN Seitenkopf-Zeichnungen gebraucht.
  Fehlt es, bleibt auf allen Unterseiten die Zeichnung unsichtbar (ist schon passiert).
  Tempo: Startseite und Unterseiten laufen zügig (unter ~2,5 s) – lieber mehr Stufen
  als langsamere Bewegung. Startseite und Handy zeigen denselben Ablauf.
  Anruf-Leiste (Anrufen/Anfrage) erscheint nicht auf der Kontaktseite – man ist schon da.
  Sie steckt in `_build/partials/callbar.html`, build.py lässt sie bei kontakt.html weg.
  Bei offenem Menü muss das Schließen-Kreuz sichtbar bleiben.
  Mobiles Menü und Anruf-Leiste nur über opacity/transform bewegen (kein clip-path),
  sonst ruckelt es auf dem Handy. Anruf-Leiste mit zwei Schwellen (rein ab 75 %, raus unter 45 %).
- Mobile-first. Nach jeder Änderung auf Handybreite (320–414 px) prüfen: kein seitliches Scrollen,
  Tap-Flächen groß genug. Hover-Effekte nur für Maus (`@media (hover: hover/none)`).
- **Leistung auf dem Handy** (Abschnitt „Leistung auf dem Handy“ in style.css):
  Auf Touch-Geräten sind `backdrop-filter`, `mix-blend-mode`, `mask-image` und Parallax
  abgeschaltet – genau diese vier haben die Seite auf dem Handy ruckeln lassen.
  Sie bleiben nur für Maus-Geräte aktiv. Beim Hinzufügen neuer Effekte daran denken.
  Menü und Anruf-Leiste werden per `transform` bewegt: in dem Abschnitt NIE ein
  zusätzliches `transform` auf `.nav__links` oder `.callbar` setzen, das bricht sie.
  Seitenkopf-Zeichnungen: überall gleich, die Linien zeichnen sich (`draw`). Auf dem Handy
  stärker gestaffelt (0,85 s Abstand), damit nie zwei Teile gleichzeitig laufen.
  Der Abschnitt „Leistung auf dem Handy“ MUSS am Ende von style.css stehen, sonst
  überschreiben ihn die allgemeinen Regeln weiter oben.
- Hochzählende Zahlen haben einen EIGENEN Auslöser (nicht das allgemeine Scroll-Reveal!).
  Das Reveal blendet bewusst früh ein, die Zahlen brauchen das Gegenteil: Start erst,
  wenn sie mitten im Bild stehen (62 % der Höhe), sonst ist das Hochzählen beim zügigen
  Scrollen vorbei, bevor man hinsieht. Scrollt man wieder weg, wird zurückgesetzt –
  beim nächsten Hinscrollen zählt es erneut hoch. Dauer: 1,4 s. Die echten Zahlen
  stehen im HTML und werden erst beim Start auf 0 gesetzt – so bleibt nie eine 0 stehen.

## Inhaltliche Regeln
- Nie von Subunternehmern sprechen. Aber auch nichts behaupten, was nicht belegt ist
  (z. B. keine Zahlen zu Mitarbeitern oder Maschinen).
- Maschinen nur allgemein: „eigene Baumaschinen“ / „eigener Maschinenpark“ – keine Anzahl, keine Typen.
- Einsatzgebiet: Munster und rund 60 km Umkreis (u. a. Soltau, Bergen, Celle, Uelzen, Walsrode,
  Lüneburg), größere Bauvorhaben auch darüber hinaus. Keine Landkreis-Aufzählung mehr.
- Referenz Celle (Rohbau Mehrfamilienhaus, 6 WE) war ein KLEINER Auftrag – nie als Hauptreferenz
  herausstellen, nicht auf der Startseite, nicht in Kennzahlen. Größere Projekte folgen noch.
- Zwei Zielgruppen sauber trennen: Bauherren/Bauträger (Neubau, Sanierung) vs. Investoren
  (Projektentwicklung Ukraine, eigene Seite `projektentwicklung.html`, auf der Startseite nur dezenter Hinweis).
- Investoren-Seite: keine Renditeversprechen; der Hinweis „kein öffentliches Angebot“ bleibt drin.

## Offen vor dem Livegang
- Fotos: David legt Originale in `assets/bilder/` ab (Anleitung dort in LIESMICH.md).
  `python _build/bilder.py` schneidet zu und erzeugt die Web-Fassungen in `assets/img/`
  (WebP, je klein/gross). Neue Fotos in der Liste BILDER in `_build/bilder.py` eintragen.
  Originale sind über .gitignore vom Repo und damit vom Upload ausgeschlossen.
  Noch offene Platzhalter: Porträt Eugen (Über uns), Projektentwicklung,
  drei Karten auf der Referenzseite.
- Keine Stockfotos verwenden (liegen in `assets/bilder/Stock falls nötig/`): wirken unecht
  neben den echten Baustellenbildern und brauchen eine Lizenz samt Urhebernennung.
- Entwurfsschutz aufheben: `ROBOTS_DEFAULT` in `_build/build.py` auf "index, follow",
  `robots.txt` auf Allow, Entwurfs-Hinweis aus `_build/partials/header.html`.
- Gelb markierte `<span class="todo">`-Stellen füllen (Projekte, Impressum, Zitat, Datenschutz).
- Hinweis „Entwurf · Fotos sind Platzhalter“ in `_build/partials/header.html` entfernen.
- Kontaktformular: geht über `kontakt.php` per E-Mail an info@waigelbau.de.
  Braucht PHP, läuft also erst auf dem Webspace – in der lokalen Vorschau erscheint ein Hinweis.
  Nach dem ersten Upload einmal echt testen (auch Spam-Ordner prüfen).
- Impressum: Betreiber/Rechtsform, USt-IdNr., ggf. Handwerkskammer ergänzen.

## Hosting, Domain und Livegang – NICHT ANFASSEN
Das gesamte Hosting-, DNS- und Livegang-Setup wird in einem **separaten Cowork** verwaltet,
nicht in diesem Chat. Tabu sind deshalb:
- Custom Domain, DNS, jede `CNAME`-Datei
- GitHub-Pages-Einstellungen (Settings → Pages)
- `.github/workflows/deploy-ionos.yml` – bleibt wie er ist: Push auf main = nur
  Verbindungstest, KEIN Upload; echter Upload nur manuell (Actions → Run workflow → Modus „live“)

Wenn eine Aufgabe eine CNAME-Datei, Domain-Konfiguration oder Workflow-Änderung nötig
erscheinen lässt: **nicht selbst machen**, sondern David kurz sagen, was man vorhätte, und
auf seine Antwort warten. Die Seite darf noch nicht unter waigelbau.de live gehen.
Inhaltliche Arbeit an Seiten, CSS, JS und Build läuft davon unberührt normal weiter.

## Arbeitsweise
- Jede Änderung als eigener Commit mit kurzer deutscher Beschreibung, danach pushen
  (Remote: https://github.com/DavidW612/waigelbauNeu.git, Branch main).
