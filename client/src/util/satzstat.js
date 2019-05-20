import {worteVonSatze} from "./formatSatze";

const uwert = satze => {  // ermittelt den uwert aller worte
  if (!(satze && Array.isArray(satze) && satze.filter(el=>!!el).length>0)) {
    console.log("Keine Satze vorhanden!  (satzstat.js, Fkt uwert)")
    return null;
  }
  const alleWorte = worteVonSatze(satze);
  let ergWorte = {...alleWorte};
  for (wo in alleWorte) {
    if (!alleWorte.hasOwnProperty(wo))  return;
      // ergWorte[wo].ueb = 
  }
};

const dwert = satze => {  // ermittelt den dwert aller worte
  if (!(satze && Array.isArray(satze) && satze.filter(el=>!!el).length>0)) {
    console.log("Keine Satze vorhanden!  (satzstat.js, Fkt uwert)")
    return null;
  }
};


module.exports = {
  uwert,
}