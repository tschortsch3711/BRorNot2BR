# BRorNot2BR

„BR or not 2 BR?“ – Eine humorvolle, aber fundierte Entscheidungshilfe rund um die Teilnahme an der Betriebsratswahl. Das Tool motiviert zur informierten Teilnahme, ohne konkrete Listen oder Personen zu nennen.

## Ziel

Mitarbeitende (Unentschlossene, Genervte, Erstwähler) in 30–60 Sekunden zu einer reflektierten Wahlentscheidung zu begleiten – freundlich, barrierearm, ohne Druck.

## Nutzung über GitHub Pages

1. Repository öffnen → **Settings** → **Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **main**, Folder: **/(root)**.
4. Speichern und auf die bereitgestellte URL zugreifen.

Die Datei `.nojekyll` ist bereits enthalten.

## Lokale Nutzung

```bash
python -m http.server 8000
```

Danach im Browser öffnen: `http://localhost:8000`.

## Datenschutz

Keine Datenübertragung, kein Tracking, kein Storage. Alles läuft lokal im Browser.

## Disclaimer

Dies ist eine unverbindliche Entscheidungshilfe und keine Rechtsberatung. Das Tool ist nicht offiziell.

## Fragen erweitern

Die Fragen liegen in `assets/questions.js` und nutzen folgendes Format:

```js
{
  id: "motivation-1",
  text: "Wenn ich an meinen Arbeitsalltag denke, will ich mitentscheiden können.",
  category: "Motivation",
  weight: 1.2,
  reverseScoring: false,
}
```

- `id`: eindeutige Kennung
- `text`: die Frage
- `category`: z. B. Motivation, Hürden, Vertrauen, Werte, Information
- `weight`: Gewichtung (0.6–1.4 empfohlen)
- `reverseScoring`: `true` invertiert die Bewertung
