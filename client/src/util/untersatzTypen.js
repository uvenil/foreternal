// berechnet die in einem Satz mit Untersatzen vorkommenden Satztypen

// Einzelne
const wortsatzTypen = satz => {
  const { wort } = satz;
  const wortsatztypen = new Set(wort.satz.filter(sa => sa._id!==satz._id).map(sa => sa.typ.wort));
  return [...wortsatztypen].sort();
};

const wortsatzeTypen = satz => {
  const { wort } = satz;
  const wortsatzetypen = new Set(wort.satze.filter(sa => sa._id!==satz._id).map(sa => sa.typ.wort));
  return [...wortsatzetypen].sort();
};

const wortesatzTypen = satz => {
  const { worte } = satz;
  let wortesatztypen = [];
  worte.forEach(wort => {
    wortesatztypen = !(wort && wort.satz)? wortesatztypen: 
      [...wort.satz.filter(sa => sa._id!==satz._id).map(sa => sa.typ.wort), ...wortesatztypen];
  });
  return [...new Set([...wortesatztypen])].sort();
};

const wortesatzeTypen = satz => {
  const { worte } = satz;
  let wortesatzetypen = [];
  worte.forEach(wort => {
    wortesatzetypen = !(wort && wort.satze)? wortesatzetypen: 
      [...wort.satze.filter(sa => !!sa && sa._id!==satz._id).map(sa => sa.typ.wort), ...wortesatzetypen];
  });
  return [...new Set([...wortesatzetypen])].sort();
};

// Kombinantionen
const wortTypen = satz => {
  const worttypen = new Set([...wortsatzTypen(satz), ...wortsatzeTypen(satz)]);
  return [...worttypen].sort();
};

const worteTypen = satz => {
  const wortetypen = new Set([...wortesatzTypen(satz), ...wortesatzeTypen(satz)]);
  return [...wortetypen].sort();
};

const satzTypen = satz => {
  const satztypen = new Set([...wortsatzTypen(satz), ...wortesatzTypen(satz)]);
  return [...satztypen].sort();
};

const satzeTypen = satz => {
  const satzetypen = new Set([...wortsatzeTypen(satz), ...wortesatzeTypen(satz)]);
  return [...satzetypen].sort();
};

const alleTypen = satz => { // alle im satz und Untersatztyen
  const alletypen = new Set([
    ...wortsatzTypen(satz), 
    ...wortesatzTypen(satz), 
    ...wortsatzeTypen(satz), 
    ...wortesatzeTypen(satz)
  ]);
  return [...alletypen].sort();
};

const subtypliste = (satz, subtyp, rtg) => {  // Typen für Kreuzwort
  if (rtg!=="Details") rtg = "Ueberblick"
  if (subtyp==="Satztyp") subtyp = satz.typ.wort;
  if (subtyp!=="Alle") {
    return [subtyp];
  } // subtyp==="Alle"
  if (rtg==="Details") {
    return untersatzTypen.satzTypen(satz);
  } else {
    return untersatzTypen.satzeTypen(satz);
  }
};

const untersatzTypen = {
  wortsatzTypen,
  wortesatzTypen,
  wortsatzeTypen,
  wortesatzeTypen,
  wortTypen,
  worteTypen,
  satzTypen,
  satzeTypen,
  alleTypen,
  subtypliste
};

export default untersatzTypen;
