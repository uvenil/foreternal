import {
  // fileimport, 
  // randel, 
  // satzzeichenminus,
  // satzzeichenplus,
  // stoppwortliste,
  // writefile,
  einleer,
  normstr, 
  sortedobj,
  sortnachstr,
  stoppwortex,
  umlautex,
  zahlenex,
} from "../../util/wortber";

// Bei Hinzufügen neuer Optionen (=selections) beachten!
// Options-keys hier (gross, etc.) müssen mit keys übereinstimmen von:
// 1. state.optset aus SatzEditCont.js bei Optionen, bzw. ggf bei Checkboxen componentDidMount, selected
// 2. Arrays.map aus SatzEditListe.js
// 3. keys "wortOpt", "worteOpt" hier
// 4. keys im key "Bearbeitungseinstellungen", "optset" bei Optionen, bzw. ggf. "selected" bei Checkboxen hier
// 5. SatzEditCont.js Fkt changeWort(e) reihenfolge ergänzen (bei Checkboxen option als value)

const SatzEditOpt = (satztypen) => ({
  // value = Objekt => key ist Option (Key grossgeschrieben)
  // value = sonstiges => key ist Checkbox (key kleingeschrieben für Checkbox mit wort(e)-Funktion, sonst groß)
  // value = Set => key ist Optionstyp (worteOpt)
  // value = String => key ist Trennzeichen
  // input und style sind keine Optionswerte, sondern Metawerte, die die Art der selection bestimmen

  // Zuordnunng der Optionen
  "wortOpt": new Set([  // Optionen, welche die Überschrift (wort) ändern
    "Gross",
    "Inhalt",
    "Laenge",
    "Position",
    "ohne Stoppworte",
  ]),
  "worteOpt": new Set([ // Optionen, welche die Worte des Satze (worte) ändern
    "Grossschreibung",
    "Zeichen",
    "Reihenfolge",
    "umgekehrt",
  ]),
  "checkBox": new Set([ // Checkboxen
    "Einstellungen anwenden",
    "ohne Stoppworte",
    "umgekehrt",
    "Überschriftssatz",
    "Vorschau anzeigen",
  ]),

  // wort-Optionen
  "Gross": {
    "egal": worte => worte, 
    "groß geschrieben": worte => worte.filter(wort => wort!==wort.toLowerCase()), 
    "klein geschrieben": worte => worte.filter(wort => wort===wort.toLowerCase()), 
    "input": {z:0, t:0},
  },
  "Inhalt": { 
    "egal": worte => worte, 
    "enthält": (worte, string) => worte.filter(wort => wort.includes(string)),
    "ohne": (worte, string) => worte.filter(wort => !wort.includes(string)),
    "input": {z:0, t:1}, // + 1 Textinput
  },
  "Laenge": { 
    "egal": worte => worte, 
    "genau": (worte, len) => worte.filter(wort => wort.length===Number(len)),
    "x-kürzestes": (worte, x) => [worte.sort((a,b) => (a.length - b.length))[Number(x)-1]],
    "x-längstes": (worte, x) => [worte.sort((a,b) => (b.length - a.length))[Number(x)-1]],
    "zwischen L": (worte, lenMin, lenMax) => worte.filter(wort => (wort.length>=lenMin && wort.length<=lenMax)),
    "input": {z:2, t:0}, // + 2 Zahleninput
  }, 
  "Position": {
    "egal": worte => worte, 
    "x-tes": (worte, x) => Number(x)===0 ? [] : Number(x)>0 ? [worte[Number(x)-1]] : [worte.reverse()[-Number(x)-1]], // -1 vom Ende her
    "zwischen P": (worte, x, y) => worte.slice(Math.max(0, (Number(x)-1)), Math.min((Number(y)), worte.length)),  // Number(x) wichtig, da bei x=1: x+1=11 (Text) oder x+1=2 (Zahl)
    "input": {z:2, t:0}, // + 2 Zahleninput
  },
  "ohne Stoppworte": (worte, stopworte) => stoppwortex(worte, stopworte), // Checkbox
  "Überschriftssatz": true, // Checkbox

  // worte-Optionen
  "Bearbeitungseinstellungen": {
    "standard": {
      optset: {  // Array nötig, damit Zahl- und Text-Inputfelder möglich
        Bearbeitungseinstellungen: ["standard"],
        Gross: ["egal"],
        Grossschreibung: ["unverändert"],
        Inhalt: ["egal", ""],
        Laenge: ["egal", 0, 0],
        Position: ["egal", 0, 0],
        Reihenfolge: ["alphabetisch", ""],
        Satzzeichen: ["ohne Satzzeichen"],
        typ: ["Satz"],
      },
      selected: new Set([
        "allesaetze", 
        "Einstellungen anwenden",
        "ohne Stoppworte", 
        "Überschriftssatz",
        "Vorschau anzeigen",
      ])
    },
    "vorsichtig": {
      optset: {  // Array nötig, damit Zahl- und Text-Inputfelder möglich
        Bearbeitungseinstellungen: ["vorsichtig"],
        Gross: ["groß geschrieben"],
        Grossschreibung: ["unverändert"],
        Inhalt: ["egal", ""],
        Laenge: ["zwischen L", 6, 30],
        Position: ["zwischen P", 0, 10],
        Reihenfolge: ["unverändert", ""],
        Satzzeichen: ["ohne Satzzeichen"],
        typ: ["Satz"],
      },
      selected: new Set([
        "allesaetze", 
        "ohne Stoppworte", 
      ])
    },
    "style": () => ({fontWeight:600 }),
    "input": {z:0, t:0}
  },
  "Einstellungen anwenden": true, // Checkbox
  "Vorschau anzeigen": true, // Checkbox
  "Grossschreibung": {
    "unverändert": str => str,
    "Eingabe": (str, p1, p2, org) => org,
    "Kleinbuchstaben": str => str.toLowerCase(),
    "Wortanfang groß": str => str.split(" ").map(wo => (wo.slice(0,1).toUpperCase() + wo.slice(1).toLowerCase())).join(" "),
    "Großbuchstaben": str => str.toUpperCase(),
    "input": {z:0, t:0},
  },
  "Zeichen": {
    "unverändert": str => str,
    "Eingabe": (str, p1, p2, org) => org,
    "Leerzeichen einfach": str => einleer(str),
    "ohne Satzzeichen": str => normstr(str),
    "ohne Zahlen+Zeichen": str => zahlenex(str),
    "ohne Umlaute": str => umlautex(str),
    // "mit Satzzeichen": str => satzzeichenminus(str), // fkt. noch nicht
    "input": {z:0, t:0},
  },
  "Reihenfolge": { 
    "unverändert": str => str,
    "Eingabe": (str, p1, p2, org) => org,
    "bevorzugt": (str, sortstr) => sortnachstr(str, sortstr),
    "alphabetisch": str => einleer(str).split(" ").sort().join(" "),
    "input": {z:0, t:1}, // + 1 Textinput
  },
  "umgekehrt": str => einleer(str).split(" ").reverse().join(" "), // Checkbox
  // allgemein
  "typ": !satztypen ? {} : {  // Option, keine Checkbox, trotz Kleinschreibung
    // ...Object.assign({}, ...[...Object.keys(satztypen)].sort().map(k => ({[k]:obj[k]}) )), 
    ...sortedobj(satztypen), 
    "label": " ",
    "style": (o) => ({color: satztypen[o], fontWeight:600 }),
    "input": {z:0, t:0},
  },
  "trenn": "!§$%&()=?" // Trennzeichen zur Separation von Name und Index der optset-Arrays im name von createSelect()
})

export default SatzEditOpt;
