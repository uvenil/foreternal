const initFilter = {
  boolean: {
    "Stopworte": true,
    "Nicht-Stopworte": true,
    "Typworte": true,
    "Nicht-Typworte": true,
    "Detail-Wortzahl größer gleich": true,
    "Detail-Wortzahl kleiner": true,
    "Überblick-Wortzahl größer gleich": true,
    "Überblick-Wortzahl kleiner": true,
    "D Überschriftenanzahl größer gleich": true,
    "D Überschriftenanzahl kleiner": true,
    "Ü Satzvorkommen größer gleich": true,
    "Ü Satzvorkommen kleiner": true,
  },
  values: {
    "detwz": 1,  // minimale Detail-Wortzahl
    "uebwz": 1,  // minimale Überschrift-Wortzahl
    "detanz": 1,  // minimale Anzahl Detailsatze (satze) 
    "uebanz": 1,  // minimale Anzahl Überschriftssatze (satz)
  }
}

export default initFilter;