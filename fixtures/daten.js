const fs = require('fs');
// const util = require('util');

const {stoppwortliste} = require('./stoppwortliste');

// Convert fs.readFile into Promise version of same    
// const readFile = util.promisify(fs.readFile);

class Fixture {
  constructor(filename) {
    this.filename = filename || "/home/micha/Schreibtisch/werkma/utxt/fixtures/NietscheZitate.txt";
    this.satztypen = [
      "Liste",
      "Gruppe",
      "Schritte",
      "Taggruppe",
      "Negativtaggruppe",
      "Linkkette",
      "Objektattribute",
      "Details",
      "Erbfolge",
      "Hierarchie",
      "Voraussetzung",
      "UrsacheWirkung",
      "Dateipfad",
      "URL",
      "Satz",
      "Absatz",
      "Alle"
    ];
    this.usernames = [
      "m",
      "C",
      "ic",
      "a",
      "C+I+L+N"
    ];
  }

  randel(arr) { // liefert Zufallselement
    if (!Array.isArray(arr)) {
      console.log(`Fehler Fkt randel: Array erwartet, aber Parameter arr ist kein Array: ${arr}`);
      return;
    }
    const min = 0;
    const max = arr.length;
    const ix = Math.floor(Math.random() * (max - min)) + min;
    return arr[ix];
  }

  fileimport(filename) {
    if (!filename)  filename = this.filename;
    const file = fs.readFileSync(`./${filename}`, "utf8");
    const zeilen = String(file).split(/\n/);
    console.log("Anzahl Zeilen:", zeilen.length);
    return zeilen;
  }
  
  zitate(filename) {
    const zeilen = this.fileimport(filename);
    const zitate = [];
    zeilen.forEach((zeile, ix) => {
      if (String(zeile).includes("mehr →")) {
        zitate.push(zeilen[ix + 1]);  // nachfolgende Zeile einfügen
      }
      return;
    });
    console.log("Anzahl Zitate:", zitate.length);
    return zitate;
  }

  normstr(satzstr) {  // entfernt Sonderzeichen, mehrfach Leerzeichen, toLowerCase
    let normstr = String(satzstr);
    normstr = normstr.replace(/[^a-zäöüßA-ZÄÖÜ 0-9]/g, ""); // Satzzeichen entfernen  // normstr = normstr.replace(/[^a-zA-Z 0-9]/g, "");
    // normstr = normstr.replace(/[.,;:–!?=«\"\']/g, ""); // Satzzeichen entfernen  // normstr = normstr.replace(/[^a-zA-Z 0-9]/g, "");
    normstr = normstr.replace(/\s{2,}/, " "); // Mehrfach-Leerzeichen löschen
    normstr = normstr.toLowerCase();  // Kleinbuchstaben
    return normstr;
  }

  stoppwortex(wortarr) {
    if (!Array.isArray(wortarr)) {
      console.log(`Fehler Fkt randel: Array erwartet, aber Parameter arr ist kein Array: ${wortarr}`);
      return;
    };
    const stoppex = wortarr.filter(wort => stoppwortliste.indexOf(String(wort)) === -1);
    return stoppex;
  }

  writefile(obj, file) {
    const jsonstr = JSON.stringify(obj);
    fs.writeFileSync(file, jsonstr, 'utf8');
    return;
  } 

  satzegen(filename) {
    const zitate = this.zitate(filename);
    let typ, wort, worte, username;
    let worteIf = "";
    const satze = zitate.map(zitat => {
      worte = this.normstr(zitat);
      wort = this.randel(this.stoppwortex(worte.split(" "))); // Zufallswort aus Nicht-Stoppwörtern als Satzüberschrift
      typ = this.randel(this.satztypen);
      username = this.randel(this.usernames);
      return ({typ, wort, worte, worteIf, username});
    });
    this.writefile(satze, "./fixtures/NietscheZitate.json");
    return satze;
  }
};

const daten = new Fixture("./fixtures/NietscheZitate.txt");
const satze = daten.satzegen();


module.exports = {satze};




// StringErsterSatz: "Dies ist ein Satz"
// ZweiterSatz: "Dies sind Schritte"
// Dies: "und das"