# 🎬 MEGAKino - Streaming Portal

Eine komplette, moderne Streaming-Plattform im **Rot-Gelb Design** mit Unterstützung für Google Drive Videos!

## ✨ Features

✅ **Komplettes Streaming Portal** mit Filmen, Serien und Dokumentationen  
✅ **Rot-Gelb Farbschema** (professionelles Design)  
✅ **Google Drive Video Player** - Filme direkt von Google Drive abspielen  
✅ **Watchlist-System** - Favoriten speichern und verwalten  
✅ **Watch-History** - Zuletzt angesehene Inhalte tracken  
✅ **Suchfunktion** - Filme, Serien, Dokumentationen durchsuchen  
✅ **Filter & Sortierung** - Nach Genre, Jahr, Bewertung filtern  
✅ **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile  
✅ **Lokale Speicherung** - Watchlist und History in Browser gespeichert  
✅ **Moderne UI** - Hover-Effekte, Animationen, Modales Design  

---

## 📁 Dateistruktur

```
seite/
├── index.html                  # Homepage
├── filme.html                  # Alle Filme
├── serien.html                 # TV-Serien
├── dokumentation.html          # Dokumentationen
├── watchlist.html              # Meine Watchlist
├── megakino.html               # Demo-Seite (optional)
│
├── css/
│   ├── common.css
│   ├── styles.css
│   ├── engine.css
│   ├── fontawesome.css
│   └── megakino.css            # ⭐ Hauptstylesheet (Rot-Gelb Design)
│
├── js/
│   ├── megakino-db.js          # Filmdatenbank & Funktionen
│   ├── filme.js                # Filme-Seite Logik
│   └── megakino.js             # Demo-Seite (optional)
│
└── templates/
    └── popcornie-dark/
        └── (Bestehende Assets)
```

---

## 🚀 Schnellstart

### 1. **Seite öffnen**
```
/filme.html          # Alle Filme anschauen
/serien.html         # Serien
/dokumentation.html  # Dokumentationen
/watchlist.html      # Meine Watchlist
```

### 2. **Filme hinzufügen**

Die Filmdatenbank befindet sich in `/js/megakino-db.js`. Um neue Filme hinzuzufügen:

```javascript
const MEGAKINO_MOVIES = [
	{
		id: 1,
		title: "Filmtitel",
		year: 2024,
		genres: ["Action", "Drama"],
		rating: 8.5,
		image: "https://link-zum-poster.jpg",
		cover: "https://link-zum-cover.jpg",
		description: "Kurzbeschreibung",
		longDescription: "Lange Beschreibung",
		cast: "Schauspieler1, Schauspieler2",
		director: "Regisseur Name",
		rating_count: 45000,
		type: "movie",  // "movie", "series", "documentary"
		googleDriveId: "",
		videoUrl: "https://www.youtube.com/embed/example",
		tagline: "Kurzer Slogan"
	},
	// ... mehr Filme
]
```

---

## 🎥 Google Drive Videos integrieren

### So packst du Google Drive Videos rein:

#### **Schritt 1: Video auf Google Drive hochladen**
1. Gehe zu [Google Drive](https://drive.google.com)
2. Lade deine Video-Datei hocherzhut
3. Mache es **"Öffentlich"** oder **"Jeder mit Link kann ansehen"**

#### **Schritt 2: Google Drive ID extrahieren**

Beispiel Google Drive Link:
```
https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view
                                  ^^^^^^^^^^^^^^^^^^^^^^
                                  Dies ist die Drive ID
```

#### **Schritt 3: In der Datenbank eintragen**

```javascript
{
	id: 999,
	title: "Mein Film von Drive",
	year: 2024,
	// ... andere Properties
	googleDriveId: "1a2b3c4d5e6f7g8h9i0j",  // ← Drive ID hier eintragen
	videoUrl: "",  // Leer lassen wenn Google Drive benutzt wird
	type: "movie"
}
```

#### **Schritt 4: Fertig!**

Der Player zeigt automatisch das Video von Google Drive an, wenn eine Drive ID vorhanden ist.

---

## 🎨 Design & Farben

Das Portal nutzt ein **modernes Rot-Gelb Farbschema**:

```css
--accent: #ff6b35          /* Orange-Rot */
--accent-2: #ffb84d        /* Gelb */
--accent-dark: #e55a2b     /* Dunkles Rot */
--bg: #0a0a0a              /* Schwarz */
--bg-2: #1a1a1a            /* Dunkelgrau */
--bg-3: #2d2d2d            /* Grau */
--gradient: linear-gradient(90deg, #ff6b35 0%, #ffb84d 100%)
```

---

## 📊 Watchlist & History

### Automatisch gespeichert in:
- `localStorage.megakino_watchlist` - Favoriten
- `localStorage.megakino_history` - Watch-History

### Funktionen:
```javascript
// Watchlist verwalten
getWatchlist()           // Alle Favoriten abrufen
saveWatchlist(data)      // Favoriten speichern
toggleWatchlist(movie)   // Film zu/von Watchlist hinzufügen
isInWatchlist(movieId)   // Prüfen ob Film in Watchlist

// History verwalten
getWatchHistory()        // Angesehene Filme abrufen
saveWatchHistory(data)   // History speichern
addToWatchHistory(movie) // Film zur History hinzufügen
```

---

## 🔍 Suchfunktion

Durchsucht automatisch:
- Filmtitel
- Beschreibung
- Cast (Schauspieler)
- Director (Regisseur)
- Genres

---

## 🎬 Video-Player

Der Player unterstützt automatisch:

1. **Google Drive Videos** (mit `googleDriveId`)
2. **YouTube Embeds** (mit `videoUrl`)
3. **Lokale Videos** (HTML5 Video fallback)

Priorisierung:
1. Google Drive (falls ID vorhanden)
2. YouTube Embed (falls videoUrl vorhanden)
3. Fallback zu lokalen Videos

---

## 📱 Responsive Design

- ✅ **Desktop** - Vollständig optimiert
- ✅ **Tablet** - 1024px und darunter
- ✅ **Mobil** - 768px und darunter
- ✅ **Klein** - 480px und darunter

---

## 🔧 Filter & Sortierung

### Filme filtern nach:
- **Genre**: Action, Drama, Komödie, Horror, Sci-Fi, etc.
- **Jahr**: 2024, 2023, 2020er, 2010er, 2000er, 1990er
- **Bewertung**: 9+, 8+, 7+, 6+

### Sortierung:
- **Trending** - Nach Anzahl Bewertungen
- **Neuste zuerst** - Nach Jahr absteigend
- **Nach Bewertung** - Nach Rating absteigend
- **A - Z** - Alphabetisch

---

## 📈 Statistiken

Die **Watchlist-Seite** zeigt:
- Gesamtanzahl Einträge
- Anzahl Filme
- Anzahl Serien & Sonstiges

---

## 🌟 Highlights

### Datenbank mit 20+ echten Filmen:
- Dune: Part Three (2026) ⭐ 8.8
- Avatar: The Way of Fire (2025) ⭐ 8.6
- Oppenheimer (2023) ⭐ 8.4
- The Shawshank Redemption (1994) ⭐ 9.3
- und viele mehr...

### 6+ TV-Serien:
- Breaking Bad ⭐ 9.5
- Game of Thrones ⭐ 9.3
- Stranger Things ⭐ 8.7
- und mehr...

### 6+ Dokumentationen:
- Planet Earth ⭐ 9.4
- Our Planet ⭐ 9.3
- Cosmos ⭐ 9.3
- und mehr...

---

## 🛠️ Technologie Stack

- **HTML5** - Semantische Struktur
- **CSS3** - Modernes Design mit Gradients & Animationen
- **JavaScript (Vanilla)** - Keine externen Abhängigkeiten nötig
- **Font Awesome** - Icons
- **LocalStorage API** - Persistente Daten

---

## 📝 Lizenz

Für private und kommerzielle Nutzung frei verwendbar.

---

## 💡 Tipps

1. **Verwende hochwertige Poster-Bilder** (180x270px optimal)
2. **Schreibe aussagekräftige Beschreibungen** für bessere Suchbarkeit
3. **Nutze Google Drive für große Video-Dateien**
4. **Teste auf Mobil-Geräten** bevor du live gehst
5. **Update die Datenbank regelmäßig** mit neuen Inhalten

---

**Viel Erfolg mit deinem MEGAKino Portal! 🚀**
