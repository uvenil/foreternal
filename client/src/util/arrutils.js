const trimarray = (arr, exclude=[undefined, null]) => {  // kappt die Rand-Elemente, die null oder undefined sind
  if (!(arr && Array.isArray(arr) && arr.filter(el=>!!el).length>0)) {
    return null;
  }
  if (!(exclude && Array.isArray(exclude) && exclude.filter(el=>!!el).length>0)) {
    return null;
  }
  let ixStart, ixEnde;
  arr.forEach((el, ix) => {
    // Bedingung kann abgeändert werden
    let cond = !exclude.includes(el);   
    if (!(ixStart>=0) && cond)   ixStart = ix;
    if (cond)   ixEnde = ix;
  });
  return arr.slice(ixStart, ixEnde+1);
};

const trimmatrix = (matrix, exclude=[undefined, null]) => {  // kappt die Rand-Elemente, die null oder undefined sind;   matrix = [][]
  if (!(matrix && Array.isArray(matrix) && matrix.filter(el=>!!el).length>0)) {
    return null;
  }
  let trima = matrix.map(arr => trimarray(arr, exclude));
  return trimarray(trima);
};

const fillmatrix = (matrix) => {  // setzt die Länge der Arrays eines 2D-Arrays auf die maximale Länge
  // const neumatrix = [...matrix];
  const lenArr = matrix.map(arr => arr.length)
  const maxLen = Math.max.apply(null, lenArr);
  matrix.forEach(arr => arr.length = maxLen);
  return matrix;
};

const arrset = arr => { // liefert ein Set der aus den Array-Werten
  let set = new Set();
  return arr.filter(el => {
    if (set.has(String(el)))  return false;
    set.add(String(el));
    return true;
  });
};

const arrsets = (arrays, reverse=true) => { // erzeugt ein Array von einzigartigen Arrays, reverse = Doppelte Elemente in kleineren Indices werden gelöscht
  if (!Array.isArray(arrays)) return;
  let arrs = reverse? [...arrays].reverse(): [...arrays];
  let set = new Set();
  arrs = arrs.map(arr => arr.filter(el => {
    if (set.has(String(el)))  return false;
    set.add(String(el));
    return true;
  }));
  if (reverse)  arrs.reverse();
  return arrs;
};

const arr2obj = (arr, key) => {  // [{a, b}, {a, b}] => {av1:[{b}], av2:[{b}]}
  let neuobj = {};
  arr.forEach((obj, ix) => {
    neuobj[obj[key]] = {...obj};
    delete  neuobj[obj[key]][key];
  })
  return neuobj;
};

const obj2arr = (obj, neukey) => {  // {av1:[{b}], av2:[{b}]} => [{a, b}, {a, b}]
  const neuarr = [];
  for (let key in obj) {
    neuarr.push({...obj[key], [neukey]:key});
  }
  return neuarr;
};

module.exports = {
  arr2obj,
  arrset,
  arrsets,
  fillmatrix,
  obj2arr,
  trimarray,
  trimmatrix,
}