const detailsatzliste = (satz, subtyp, stopworte, mitBasissatz) => {
  if (mitBasissatz!==false)  mitBasissatz = true; // standardmäßig Basissatz am Anfang der Liste
    if (subtyp==="Satztyp") subtyp = satz.typ.wort;
    let satzliste = satz.worte.filter(  // Details
      wort => wort && wort.satz && wort.satz.length>0 && !stopworte.includes(wort.wort)).map(  // && (wort.wort !== satz.wort.wort)
      wort => wort.satz).flat().filter(subsatz => { // ggf. Subtyp filtern
        if (subsatz._id===satz._id) return false;
        if (subtyp==="Alle")    return true;
        return subtyp===subsatz.typ.wort;
      }).sort((a, b) => a.typ.wort.localeCompare(b.typ.wort));
    if (mitBasissatz) satzliste.unshift(satz);
    return satzliste;
  };
  
const ueberblicksatzliste = (satz, subtyp, stopworte, mitBasissatz) => {
  if (mitBasissatz!==false)  mitBasissatz = true; // standardmäßig Basissatz am Anfang der Liste
  let flags = {}; // Variable flags dient zur Identifizierung von Doppelten
  if (subtyp==="Satztyp") subtyp = satz.typ.wort;
  let satzliste = satz.worte.filter(  // Überblick
    wort => wort && wort.satze && wort.satze.length>0 && !stopworte.includes(wort.wort)).map(
    wort => wort.satze).flat().filter(subsatz => { // Doppelte entfernen
      if (!(subsatz && subsatz._id))  return false;
      if (flags[subsatz._id] || subsatz._id===satz._id) return false;
      flags[subsatz._id] = true;
      return true;
    }).filter(subsatz => { // ggf. Subtyp filtern
      if (subtyp==="Alle")    return true;
      return subtyp===subsatz.typ.wort;
    }
  ).sort((a, b) => a.typ.wort.localeCompare(b.typ.wort));
  if (mitBasissatz) satzliste.unshift(satz);
  return satzliste;
};

const satzListe = {ueberblick:ueberblicksatzliste, detail:detailsatzliste};


export default satzListe;