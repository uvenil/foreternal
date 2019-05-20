const {
  isObject,
  modobjval,
  subobj, 
} = require("./objutils"); // import funktioniert merkwürdigerweise nicht, aber require

const isNumBool = val => (
  typeof val==="boolean" || (typeof val==="number" && val!==NaN)
);

const haeuf = arr => {
  if (!Array.isArray(arr) || arr.length===0) {
    console.log("Fkt. haeuf: Kein volles Array vorhanden!");
    return null;
  }
  let set = new Set();
  let value;
  const hf = {};
  arr.forEach(val => {
    value = String(val);
    if (set.has(value)) {
      hf[value]++;
    } else {
      set.add(value);
      hf[value] = 1;
    }
  });
  return hf;
};

const haeufigkeit = (objarr, key) => {  // Häufigkeit der Werte eines Keys im Objektarray
  if (!objarr || !objarr.length>0) {
    console.log("Fkt. haeufigkeit: Keine Objekte vorhanden!");
    return null;
  }
  let arr = [];
  objarr.forEach(obj => arr.push(String(subobj(obj, key))));
  const hf = haeuf(arr);
  return hf; // {wert1: anz1, wert2: anz2, ...}
};

const haeufString = hf => { // hf = Häufigkeit
  if (!isObject(hf))  return "";
  let hs = ``;
  Object.keys(hf).forEach(v => hs += `${v}:${hf[v]}, `);
  hs = hs.slice(0, hs.length-2);
  return hs; // "v1:h1, v2:h2, ..."
};

const mittelwert = arr => {
  const sum = arr.reduce((sum, value) => sum + value, 0);
  const avg = sum / arr.length;
  return avg;
};

const objsubstat = obj => { // {a: {x: 2, y: 3}, b: {x: 1, y: 6}} -> {x: {n, mw, ...}, y: {n, mw, ...}}
  // alle k2 mit Zahlenwerten sammeln
  let k2Set = new Set();
  for (let k1 in obj) {
    if (!isObject(obj[k1])) continue;
    for (let k2 in obj[k1]) {
      if (!k2Set.has(k2) && isNumBool(obj[k1][k2])) {
        k2Set.add(k2);
      };
    }
  }
  // Werte-Arrays unter Attribut k2 (valarrs[k2])
  let valarrs = {};
  k2Set.forEach(k2 => valarrs[k2] = []);
  // Werte-Arrays befüllen
  for (let k1 in obj) {
    if (!isObject(obj[k1])) continue;
    k2Set.forEach(k2 => {
      if (isNumBool(obj[k1][k2])) {
        valarrs[k2].push(Number(obj[k1][k2]));
      };
    });
  }
  // statwerte aus den Wertearrays berechnen
  let objstat = {}; // {werte: {}, haeuf: {}};
  k2Set.forEach(k2 => {
    objstat[k2] = stathaeuf(valarrs[k2]);
  });
  return objstat;
};

const roundnr = (number, stellen = 0) => (
  typeof (number)!=="number"?
  number:
  Math.floor((number*Math.pow(10, stellen)) + 0.5) / Math.pow(10, stellen)
);

const stathaeuf = valarr => { // statwerte inkl. haeufigkeit
  let stath = {...statwerte(valarr), haeuf: haeuf(valarr)};
  return stath;
};

const statStr = (valarr, modFkt = x=>x) => {
  let sw = statwerte(valarr);
  sw = modobjval(sw, modFkt);
  return statString(sw);
  // return `${sw.min}:${sw.mu}|${sw.mw}|${sw.mo}:${sw.max}`; // sw = statwerte
};

const statString = sw => {
  return `${sw.min}:${sw.mu}| ${sw.mw} |${sw.mo}:${sw.max}`; // sw = statwerte
};

const statwerte = valarr => { // statistiche Werte von einem Array
  const mw = mittelwert(valarr);
  const sd = stddev(valarr);
  return ({
    n: valarr.length,
    min: Math.min.apply(null, valarr),
    mu: mw - sd,
    mw,
    mo: mw + sd,
    max: Math.max.apply(null, valarr),
    sd,
  })
};

const stddev = values => { // mit n, nicht n-1!
  const avg = mittelwert(values);
  let diff, sqrDiff;
  const squareDiffs = values.map(value => {
    diff = value - avg;
    sqrDiff = diff * diff;
    return sqrDiff;
  });
  const avgSquareDiff = mittelwert(squareDiffs);
  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
};

module.exports = {
  haeuf,
  haeufigkeit,
  haeufString,
  mittelwert,
  objsubstat,
  roundnr,
  stathaeuf,
  statStr,
  statString,
  statwerte,
  stddev
};