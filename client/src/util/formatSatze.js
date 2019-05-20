const formatSatze = satze => (  // -> Bearbeitungs-, Speicherformat;  formatiert satze für das Editieren und Abspeichern über "addFullSatze" (=> saetze)
  // Ladeformat -> Speicher- und Bearbeitungsformat (editSatze)
  // {wort:ObjID, worte:[ObjID], ...} -> {wort:"wort", worte:"wort wort", ...}
  // Rückumwandlung erfolgt über Speicherung (addFullSatze) / Update
  // Falls schon das Bearbeitungsformat vorliegt, wird dieses einfach zurückgegeben
  (!satze || !satze.length>0 || typeof satze[0].wort === "string" || typeof satze[0].worte === "string")? satze:
  satze.map(satz => (
    // console.log({satz}) || 
  {
    _id: satz._id,
    wort: (() => (satz.wort && satz.wort.wort)? satz.wort.wort: null)(),
    worte: satz.worte.map(wort => (wort && wort.wort)? wort.wort: null).join(" "),
    worteIf: (!satz.worteIf || !satz.worteIf[0])? "": satz.worteIf.map(wort => (wort && wort.wort)? wort.wort: null).join(" "),  // zunächst unberücksichtigt
    typ: satz.typ.wort, // JSON.stringify(satz.typ),
    username: satz.username,
    updatedDate: formatDate(satz.updatedDate),
    createdDate: formatDate(satz.createdDate),
    groups: ("groups" in satz)? satz.groups: null,
  }))
)

const pick = (objArr, keyArr) => {  // extrahiert die keys aus keyArr von den Objekten in objArr
  if (!(keyArr && keyArr.length>0)) {
    return objArr;
  }
  // console.log({objArr});
  let pickObj;
  const picked = objArr.map(obj => {
    pickObj = {};
    keyArr.forEach(key => {
      if (obj && obj[key])  pickObj[key] = obj[key]
    })
    return pickObj;
  });
  // console.log({picked});
  return picked;
}

const formatDate = date => {  // formatiert TT.MM.JJ um hh:mm
  if (!date)  return date;
  const optionsD = {
    hour12: false,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };
  const optionsT = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  };
  const newDate = new Date(date).toLocaleDateString("de-DE", optionsD);
  const newTime = new Date(date).toLocaleTimeString("de-DE", optionsT);
  return `${newDate} um ${newTime}`;
};

const unformatDate = date => {  // unformatiert TT.MM.JJ um hh:mm zu ca. Sekunden
  // für Jahrhundertwechselsicherheit komplette Jahreszahl verwenden
  // keine echte Unforatierung, sondern nur Vergleichszahl (casekunden) zur Sortierung
  if (!date)  return date;
  const [datum, zeit] = date.split(" um ");
  let [tag, monat, jahr] = datum.split(".");
  let [stunde, minute] = zeit.split(":");
  jahr = Number(jahr);
  monat = Number(monat);
  tag = Number(tag);
  stunde = Number(stunde);
  minute = Number(minute);
  let temp = jahr;
  temp = monat + 12*temp;
  temp = tag + 31*temp;
  temp = stunde + 24*temp;
  temp = minute + 60*temp;
  const casekunden = 60*temp;
  return casekunden;
};

const worteVonSatze = satze => {  // Objekt mit allen verfügbaren Wort-Objekten mit dem Wort als Schlüssel und wort-Objekt als Wert {wort.wort: wort}  //Alternativ: _id als Wert {wort.wort: wort._id}
  if (!(satze || satze.length>0)) {
    console.log("Fkt worteVonSatze: Keine Satze vorhanden!  satze = ", satze);
    return null;
  }
  let alleWorte = {};
  const typArr = satze.map(satz => satz.typ);
  const wortArr = satze.map(satz => satz.wort);
  const worteArr = satze.map(satz => satz.worte).flat();
  const alleWorteArr = [...typArr, ...wortArr, ...worteArr]; 
  let keySet = new Set();
  alleWorteArr.forEach(wort => {
    if (!wort || !wort.wort || keySet.has(wort.wort))  return;
    alleWorte[wort.wort] = wort;
    keySet.add(wort.wort);
  })
  // console.log("alleWorte", {alleWorte});
  return alleWorte;
}

const upstr = (str) => {
  
}

module.exports = {
  pick,
  formatSatze, 
  formatDate,
  unformatDate,
  worteVonSatze,
}

// export default formatDate;


// const formatDate = date => {
//   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//   const newDate = new Date(date).toLocaleDateString("de-DE", options);
//   const newTime = new Date(date).toLocaleTimeString("de-DE");
//   return `${newDate} um ${newTime}`;
// };


// const options = {
//   hour12: false,
//   year: '2-digit',
//   month: '2-digit',
//   day: '2-digit',
//   hour: '2-digit',
//   minute: '2-digit'
// };
