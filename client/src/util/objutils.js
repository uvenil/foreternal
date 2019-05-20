const React = require("react"); // import funktioniert merkwürdigerweise nicht, aber require
const {Fragment} = React;
const {cmpStringsWithNumbers, naturalCompare} = require("./sort"); // import funktioniert merkwürdigerweise nicht, aber require

const arrobj = (arr, preString = "") => { // macht Array zu Objekt, [a, b, c] -> {0:a, 1:b, 2:c}
  if (!(Array.isArray(arr) && arr.length>0))  return {};
  const obj = {}
  arr.forEach((el, ix) => obj[preString + String(ix)] = el);
  return obj;
};

const combineSubObj = (obj, pre) => {  // {a: {x: {k, l}, y: {k, l}}, b: {x: {k, l}, y: {k, l}}} -> {x: {ak, al, bk, bl}, y: {ak, al, bk, bl}}
  // pre: null = keine Vorsilbe-, true = Vorsilbe, false = -Nachsilbe
  let k2s = new Set();
  let k1, k2, k3;
  for (k1 in obj) {
    if (!obj.hasOwnProperty(k1))  continue;
    for (k2 in obj[k1]) {
      if (!obj[k1].hasOwnProperty(k2))  continue;
      if (k2s.has(k2)) continue;
      k2s.add(k2);
    }
  };
  let neuObj = {};
  let neuKey;
  [...k2s].forEach(k2 => {
    neuObj[k2] = {};
    for (k1 in obj) {
      if (!obj.hasOwnProperty(k1))  continue;
      for (k3 in obj[k1][k2]) {
        if (!obj[k1][k2].hasOwnProperty(k3))  continue;
        if (obj[k1][k2][k3]!==undefined) {
          neuKey = pre===true? k1 +"-"+ k3: pre===false? k3 +"-"+ k1: k3;
          neuObj[k2][neuKey] = obj[k1][k2][k3];
        }
      }
    };
  });
  return neuObj;
};

const hasKeys = value => {  // true, wenn ein Objekt key mit value.length>0 besitzt
  if (value===null || typeof value!=="object")  return false;
  if (Object.keys(value) && Object.keys(value).length>0) return true;
  return false;
};

const keySet = (objarr) => {  // gibt alle keys aus dem Objektarray zurück
  if (!objarr || !objarr.length>0) {
    console.log("Fkt. keyset: Keine Objekte vorhanden!");
    return null;
  }
  let set = new Set();
  objarr.forEach(obj => {
    if (!hasKeys(obj))  return null
    set = new Set([...set, ...Object.keys(obj).filter(key => obj.hasOwnProperty(key))]);
  });
  if (!set.size>0)  return null
  return set;
};

const isArray = val => (
  Array.isArray(val) && val.length>0
);

const isObject = val => ( // Test auf Objekt
  typeof val==='object' && val!=null && Array.isArray(val)===false && Object.keys(val).length>0
);

const isPrimitive = value => {
  if (value==="undefined" || value==="null")  return true;
  const type = typeof value;
  if (["string", "number", "boolean", "symbol"].includes(type)) {
    return true;
  }
  return false;
};

const modobjval = (obj, fkt) => { // liefert modifiziertes Objekt, in dem alle Werte mit fkt verändert wurden
  const modobj = {};
  Object.keys(obj).forEach(k => modobj[k] = fkt(obj[k]));
  return modobj;
};

const objKeySet = objobj => {  // gibt alle keys aus dem Objektobjekt zurück
  const objarr = objobj2objarr(objobj);
  return keySet(objarr);
};

const objDeepKeySet = (obj, keyarr) => {  // keyarr = [k0, k1, null, k3, ...], 
  // [null] = alle k1,  [null, null] = alle k2,  [null, null, k2] = alle k3 von k2,   [null, k1, null, k3] = alle k4 von k3 und k1
  
  // !!! hier: Fkt objTable
};

const objobj2objarr = objobj => { // wandelt Objekt von Objekten in Array von Objekten um (Objektnamen gehen verloren)
  const objnames = Object.keys(objobj).filter(name => objobj.hasOwnProperty(name));
  const objarr = objnames.map(name => objobj[name]);
  return objarr;
};

const objTableEinfach = (objobj, bez="Werte / Objekte") => {  // stellt ein Objekt als Tabelle dar {objname1: {key1: val1, key2: val2,  objname2: {key1: val1, key2: val2, ...}}
  if (!objobj)  return null;
  const objnames = Object.keys(objobj).filter(name => objobj.hasOwnProperty(name));
  const keyset = [...objKeySet(objobj)].sort(naturalCompare);
  const colanz = objnames.length+1; // Anzahl Spalten
  const colarr = [...Array(Math.floor(colanz / 2)).keys()]; // Array zur Spalteneinfärbung in colgroup
  return (  
    <table >
      <colgroup>
        {[
          ...colarr.map(c2 => (
            <Fragment key={c2}>
              <col style={{backgroundColor: '#ddd'}}></col>
              <col style={{backgroundColor: '#eee'}}></col>
            </Fragment>
          )),
          colanz%2>0 && <col key={colarr.length} style={{backgroundColor: '#ddd'}}></col>
        ]}
      </colgroup>
      <thead>
        <tr>
          <th>{bez}</th>
          {objnames.map(name => <th key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody>
        {keyset.map(key => (
          <tr key={key}>
            <th>{key}</th>
            {objnames.map(name => <td key={name}>{val(objobj[name][key])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
};

const objTable = (objx, bez="Werte / Objekte") => {  // stellt ein Objekt der Tiefe x als Tabelle dar {objname1: {key1: val1, key2: val2,  objname2: {key1: val1, key2: val2, ...}}
  if (!objx)  return null;
  const tiefe = objTiefe(objx);

  const objnames = Object.keys(objx).filter(name => objx.hasOwnProperty(name));
  const keyset = [...objKeySet(objx)].sort(naturalCompare);
  const colanz = objnames.length+1; // Anzahl Spalten
  const colarr = [...Array(Math.floor(colanz / 2)).keys()]; // Array zur Spalteneinfärbung in colgroup
  return (  
    <table >
      <colgroup>
        {[
          ...colarr.map(c2 => (
            <Fragment key={c2}>
              <col style={{backgroundColor: '#ddd'}}></col>
              <col style={{backgroundColor: '#eee'}}></col>
            </Fragment>
          )),
          colanz%2>0 && <col key={colarr.length} style={{backgroundColor: '#ddd'}}></col>
        ]}
      </colgroup>
      <thead>
        <tr>
          <th>{bez}</th>
          {objnames.map(name => <th key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody>
        {keyset.map(key => (
          <tr key={key}>
            <th>{key}</th>
            {objnames.map(name => <td key={name}>{val(objx[name][key])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
};

const objTiefe = (obj, tiefe=0) => {
  if (isArray(obj))  obj = arrobj(obj); // array in object wandeln
  if (!isObject(obj))  return tiefe;
  let tiefen = {};
  for (let key in obj) {
    tiefen[key] = objTiefe(obj[key], tiefe+1)
  }
  return Math.max.apply(null, Object.values(tiefen));
}

const subKeySet = (objarr, key) => {  // liefert ein keySet von den Subobjekten objarr[x][key]
  const subobjarr = objarr.map(obj => (key in obj)? obj[key]: null).filter(o2 => !!o2);
  return keySet(subobjarr);
};

const subobj = (obj, keyarr) => { // erlaubt Arrays als keys
  let subObj;
  try {
    subObj = keyarr.reduce((a, k)=> a[k], obj)
  } catch(e) {
  }
  return subObj;
};

const subvalue = (obj, subkey, filterFkt) => { // liefert den ersten eindeutigen Subkey-value der niedrigsten Ebene
  console.log({obj});
  if (!Array.isArray(obj))  obj = [obj]; // Objekte der xten Ebene
  let keys, value;
  let subobj = [];
  obj.forEach(obj => {
    if (value || !isObject(obj)) return;
    keys = Object.keys(obj)
    if (keys.includes(subkey) && (!filterFkt || filterFkt(obj[subkey]))) {
      value = obj[subkey];
    } else {
      subobj.push(...keys.filter(key => isObject(obj[key])).map(key => obj[key]));
    }
  });
  if (value) return value;
  console.log({subobj});
  if (subobj.length>0) {
    return subvalue(subobj, subkey, filterFkt);
  }
  return undefined;
};

const val = value => (!!value || Math.abs(value)>=0)? value: null;

const valueSet = (objarr, key) => { // ermittelt, welche Werte ein Key in einem Objektarray einnimmt
  if (!objarr || !objarr.length>0) {
    console.log("Fkt. valueSet: Keine Objekte vorhanden!");
    return null;
  }
  let set = new Set();
  objarr.forEach(obj => {
    if (set.has(String(obj[key])))  return;
    set.add(String(obj[key]));
  });
  return set;
};

module.exports = {
  arrobj,
  combineSubObj,
  hasKeys,
  keySet,
  isObject,
  isPrimitive,
  modobjval,
  objKeySet,
  objTable,
  objTiefe,
  subKeySet,
  subobj, 
  subvalue, 
  valueSet,
};