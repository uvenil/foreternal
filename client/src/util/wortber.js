// aus: fixtures/daten.js
// Funktionen u.a. zur Wortbereinigung

const fs = require('fs');
// const util = require('util');
const {stoppwortliste} = require('./stoppwortliste');

const randel = (arr) => { // liefert Zufallselement
  if (!Array.isArray(arr)) {
    console.log(`Fehler Fkt randel: Array erwartet, aber Parameter arr ist kein Array: ${arr}`);
    return;
  }
  const min = 0;
  const max = arr.length;
  const ix = Math.floor(Math.random() * (max - min)) + min;
  return arr[ix];
}

const fileimport = (filename) => {
  if (!filename)  filename = this.filename;
  const file = fs.readFileSync(`./${filename}`, "utf8");
  const zeilen = String(file).split(/\n/);
  console.log("Anzahl Zeilen:", zeilen.length);
  return zeilen;
}

const einleer = (satzstr) => {
  return String(satzstr).trim().replace(/\s+/g, " ");
}

const satzzeichenminus = (satzstr) => {
  const str = einleer(satzstr);
  const satzzeichenStr = str.replace(/[a-zäöüßA-ZÄÖÜ 0-9]/g, "");
  const string = str.replace(/[^a-zäöüßA-ZÄÖÜ 0-9]/g, "");  // String ohne Satzzeichen
  const posObj= {}; // Positionsobjekt {"string": ,"zeichen":, [String(pos)]: zeichen, ... }
  let pos = 0;
  let zei;
  for (var i = 0; i < satzzeichenStr.length; i++) {
    zei = satzzeichenStr.charAt(i);
    pos = str.indexOf(zei, pos);
    posObj[pos] = zei;  // {[String(pos)]: zeichen}
  }
  return {string, posObj};
}

const satzzeichenplus = ({string, posObj}) => {
  const posArr = [...Object.keys(posObj)].map(s=>Number(s)).sort((a, b) => (Number(a)-Number(b)));
  let gesStr = "";
  let letztePos = 0;
  posArr.forEach((pos, ix) => {
    gesStr = gesStr + string.slice(letztePos, pos - ix) + posObj[String(pos)];
    letztePos = pos - ix;
  })
  gesStr = gesStr + string.slice(letztePos);
  return gesStr;
}

const sortedobj = (obj, sortfkt=undefined) => {
  return Object.assign({}, ...[...Object.keys(obj)]
    .sort(sortfkt).map(k => ({[k]:obj[k]}) )
  );
}

const sortnachstr = (str, sortstr) => { // str wird sorttiert gemäß dem Vorkommen von (Teil-)Strings in sortstr
  const sortarr = einleer(sortstr).split(" ");  // Array von sort-worten
  const sorted = einleer(str).split(" ") // einzelne Worte
    .sort((wa, wb) => {
      let res = { // zur Berechnung des Ergebnis-Scores beider verglichener Worte
        "score": {[wa]:0, [wb]:0},  // Sortierscore
        "found": {[wa]:false, [wb]:false},  // Wort(-teil) im Sortierstring gefunden
      };
      sortarr.forEach(sw => { // sort-worte durchlaufen
        res.found = {[wa]:false, [wb]:false}; // für das neue sort-wort noch kein Fund
        let swlen = sw.length;
        while (swlen>0 && (!(res.found[wa] && res.found[wb]))) {
          [wa, wb].filter(w => !res.found[w]).forEach(w =>{ // nur das noch nicht bewertete wort nachfolgend für dieses sort-wort bewerten
            if (w.includes(sw.slice(0, swlen))) {
              res.score[w] += Math.min(10, swlen);  // maximal 10 Punkte = sort-wort ist komplett enthalten, (oder seine ersten 10 Buchstaben)
              res.found[w] = true;  // Bewertung wurde für dieses sort-wort vorgenommen
              return;
            }
          })
          swlen--;  // durchsuchte Länge des sort-worts wird schrittweise von seinem Ende her reduziert
        }
      })
      return (res.score[wb] - res.score[wa]);
    })
    .join(" ");
  return sorted;
}

const normstr = (satzstr) => {  // entfernt Sonderzeichen, mehrfach Leerzeichen
  let normstr = einleer(satzstr);
  normstr = normstr.replace(/[^a-zäöüßA-ZÄÖÜ 0-9]/g, ""); // Satzzeichen entfernen  // normstr = normstr.replace(/[^a-zA-Z 0-9]/g, "");
  // normstr = normstr.replace(/[.,;:–!?=«\"\']/g, ""); // Satzzeichen entfernen  // normstr = normstr.replace(/[^a-zA-Z 0-9]/g, "");
  normstr = normstr.replace(/\s{2,}/, " "); // Mehrfach-Leerzeichen löschen
  // normstr = normstr.toLowerCase();  // Kleinbuchstaben
  return normstr;
}

const zahlenex = (satzstr) => {  // entfernt Zahlen, Sonderzeichen, mehrfach Leerzeichen
  let zahlenex = normstr(satzstr);
  zahlenex = zahlenex.replace(/[^a-zäöüßA-ZÄÖÜ ]/g, ""); // Zahlen entfernen
  return zahlenex;
}

const umlautex = (satzstr) => {  // entfernt Zahlen, Sonderzeichen, mehrfach Leerzeichen
  let umlautex = satzstr // Umlaute entfernen
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss")
  return umlautex;
}

const stoppwortex = (wortarr, stopworte = stoppwortliste) => {
  if (!Array.isArray(wortarr)) {
    console.log(`Fehler Fkt stoppwortex: Array erwartet, aber Parameter arr ist kein Array: ${wortarr}`);
    return;
  };
  const stoppex = wortarr.filter(wort => stopworte.indexOf(String(wort)) === -1);
  return stoppex;
}

const writefile = (obj, file) => {
  const jsonstr = JSON.stringify(obj);
  fs.writeFileSync(file, jsonstr, 'utf8');
  return;
} 

module.exports = {
  fileimport, 
  einleer,
  normstr, 
  randel, 
  satzzeichenminus,
  satzzeichenplus,
  sortedobj,
  sortnachstr,
  stoppwortex,
  stoppwortliste,
  umlautex,
  writefile,
  zahlenex,
};
