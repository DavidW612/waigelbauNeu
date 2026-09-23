# Hier kommen die Fotos rein

Alle Baustellen- und Projektfotos für die Website einfach in diesen Ordner legen
(`assets/bilder/`). Danach Bescheid sagen – der Einbau in die Seiten passiert dann hier.

## Stand: was schon eingebaut ist
Diese fünf Fotos sind aufbereitet und stehen auf der Website:
- **Neubau 2 Soltau** → Startseite (Neubau), Leistungen (Neubau), Referenzen
- **Sanierung** (Kran mit Wandelement) → Startseite (Sanierung), Leistungen (Sanierung)
- **Sanierung 2** (Bodenplatte) → Startseite und Referenzen
- **Sanierung 3** (Wandelement hochkant) → Leistungen (Sanierung, am Rechner)
- **Neubau Munster** → Referenzen, Hauptbild

## Was noch fehlt (wichtigste zuerst)
1. **Porträt von Eugen**, am besten auf der Baustelle – die größte Lücke,
   weil die ganze Seite mit „ein fester Ansprechpartner“ argumentiert.
2. **Nahaufnahmen**: Mauerwerk, Klinkerfugen, Schalung, Bewehrung.
3. **Menschen bei der Arbeit** (mit Einverständnis der Abgebildeten).
4. **Zweites Hochformat** für die Neubau-Spalte auf der Leistungsseite.
5. **Vorher/Nachher** einer Sanierung.
6. Drei weitere **Projektfotos** für die Referenzseite.

## Was gebraucht wird
| Wofür | Anzahl | Format | Hinweis |
|---|---|---|---|
| Startseite Neubau | 1 | quer (16:10) | Rohbau oder Mauerwerk, gern mit Maschine im Bild |
| Startseite Sanierung | 1 | quer (16:10) | idealerweise vorher/nachher |
| Leistungen Neubau | 1 | hoch (4:5) | Detail: Mauerwerk, Schalung, Klinker |
| Leistungen Sanierung | 1 | hoch (4:5) | Bestandsgebäude |
| Über uns | 1 | hoch (4:5) | Porträt Eugen, am besten auf der Baustelle |
| Referenzen | 6–8 | quer (4:3) | pro Projekt 1–2 Bilder, plus 1 Hauptbild vom größten Projekt |
| Projektentwicklung | 1 | quer (4:3) | Standort oder Visualisierung |

## Worauf achten
- **Direkt vom Handy ist völlig in Ordnung** – nicht kleinrechnen, lieber groß liefern.
- Formate: JPG, PNG oder HEIC. Die Umwandlung ins platzsparende Web-Format passiert hier.
- Querformat für breite Bilder, Hochformat für die schmalen Spalten (siehe Tabelle).
- Keine fremden Bilder aus dem Internet – nur eigene Fotos.
- Sind Personen erkennbar, brauchen wir deren Einverständnis.
- Dateinamen egal, aber hilfreich ist etwas wie `celle-rohbau-01.jpg`.

## Technischer Ablauf (macht Claude)
Die Originale bleiben hier liegen und gehen **nicht** mit auf die Website.
`python _build/bilder.py` schneidet sie zu und legt kleine Web-Fassungen in
`assets/img/` ab – je eine für Handy und Rechner.

## Dazuschreiben
Zu jedem Projekt kurz: **Ort, Art (Neubau/Sanierung), was gemacht wurde, wann.**
Das kommt dann als Bildunterschrift bzw. in die Referenzseite.
