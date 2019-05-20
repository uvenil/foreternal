// import React from "react";
import { useQuery } from 'graphql-hooks';
import {arrsets} from "./../../util/arrutils";
import {combineSubObj} from "./../../util/objutils";
import {objsubstat} from "./../../util/stat";

const sets = ["nonstopworte", "usedSets", "satze", "ebenewort"];

const detStatInit = (wortArr, stopworte) => { // macht aus dem wortArr ein Objekt von Objekten mit key wort, keine Stopworte
  stopworte = stopworte || this.user.stopworte.map(wo => wo.wort) || [];
  let uebObj = {};
  let wortstr, worte, nonstopworte;
  console.log({wortArr});
  wortArr.forEach(wort => { // Überschriften durchlaufen
    wortstr = String(wort.wort);
    if (stopworte.includes(wortstr))  return;   // keine Stopworte
    worte = [...new Set(wort.satz.map(satz =>   // wort bildet Überschrift
      satz.worte.map(wo => String(wo.wort))).flat())] || [];  // worte im satz
    nonstopworte = !worte? [[]]: [worte.filter(w => !stopworte.includes(w) && w!==wortstr)];
    // initialisieren
    uebObj[wortstr] = {
      worte,        // worte (strings), die in satze mit der Überschrift vorkommen
      usedSets: [[...new Set([wortstr])]], // Sets mit den worten (strings), die bereits in die Bewertung eingeflossen sind (keine Doppelbewertungen)
      nonstopworte, // worto (s.o.) ohne Stopworte
      satze: [wort.satz.map(sa => sa.wort.wort+"-"+sa.typ.wort)], // Anzahl satze mit dieser Überschrift
      ebenewort: [[wortstr]], // noch etwas unklar, wozu nützlich
    }
  });
  return uebObj;
};

const uebStatInit = (wortArr, stopworte) => { // macht aus dem wortArr ein Objekt von Objekten mit key wort, keine Stopworte
  stopworte = stopworte || this.user.stopworte.map(wo => wo.wort) || [];
  let detObj = {};
  let wortstr, worte, nonstopworte;
  wortArr.forEach(wort => { // alle worte durchlaufen
    wortstr = String(wort.wort);
    if (stopworte.includes(wortstr))  return;   // keine Stopworte
    worte = [...new Set(wort.satze.map(satz =>  // wort kommt im Satz vor
      String(satz.wort.wort)))] || [];          // Überschrift des Satzes
    nonstopworte = !worte? [[]]: [worte.filter(w => !stopworte.includes(w) && w!==wortstr)];
    // initialisieren
    detObj[wortstr] = {
      worte,        // Überschriften (strings), in deren satze wortstr vorkommt
      usedSets: [[...new Set([wortstr])]], // Sets mit den worten (strings), die bereits in die Bewertung eingeflossen sind (keine Doppelbewertungen)
      nonstopworte, // worte (s.o.) ohne Stopworte
      satze: [wort.satze.map(sa => sa.wort.wort+"-"+sa.typ.wort)], // Anzahl satze mit dieser Überschrift
      ebenewort: [[wortstr]], // noch etwas unklar, wozu nützlich
    }
  });
  return detObj;
};

const rtgLoop = (rtgStat, loops=5, rtgStatInit) => { // 
  // console.log({rtgStat});
  rtgStatInit = rtgStatInit || rtgStat;
  let neuRtgStat = JSON.parse(JSON.stringify(rtgStat));  // tiefe Kopie
  let startarr;
  // console.log({loops});
  for (let wortstr in neuRtgStat) { // alle Worte durchlaufen
    let neuWorte = rtgStat[wortstr].nonstopworte[0]
      .filter(wo => !rtgStat[wortstr].usedSets[0].includes(wo)); // Worte aus den Sets zeigen bereits verwendete Worte an
    // Sets berechnen
    sets.forEach(set => {
      startarr = [];
      // startarr = ["nonstopworte", "usedSets"].includes(set)? [...rtgStat[wortstr][set][0]]: []; // Sets, die die Werte vorheriger Runden übernehmen
      neuRtgStat[wortstr][set].unshift(new Set(startarr)); // neues Set bei Index 0 starten
      neuWorte.forEach(nw => {
        rtgStatInit[nw][set][0].forEach(wo => neuRtgStat[wortstr][set][0].add(wo));
      });
      neuRtgStat[wortstr][set][0] = [...neuRtgStat[wortstr][set][0]];
    });
  }
  loops--;
  if (loops>0)  neuRtgStat = rtgLoop(neuRtgStat, loops, rtgStatInit);
  return neuRtgStat;
};

const rtgObj = (rtgstatinit, loops=5) => {
  // console.log({rtgstatinit});
  let rtgstat = rtgLoop(rtgstatinit, loops);
  for (let wortstr in rtgstat) { // alle Worte durchlaufen
    sets.forEach(set => {
        rtgstat[wortstr][set] = arrsets(rtgstat[wortstr][set], true); // Inhalte der aller Arrays nicht redundant, hintere Arrays behalten Elemente
        rtgstat[wortstr][set].reverse();
        rtgstat[wortstr][set] = rtgstat[wortstr][set].filter(arr=>arr.length>0);
    })
    rtgstat[wortstr].nsworteZahl = rtgstat[wortstr].nonstopworte
      .reduce((acc, val) => (acc + val.length), 0);
    rtgstat[wortstr].satzeZahl = rtgstat[wortstr].satze
      .reduce((acc, val) => (acc + val.length), 0);
  }
  return rtgstat; // Ergebnis-Objekt {wort: {satzZahl, nsworteZahl, ...}}   // wort ist key
};

const dust = (wort, username) => ({
  d: wort.satz.length,  // Details
  u: wort.satze.length, // Überschriften
  s: wort.stopuser.includes(username),
  t: wort.typuser.includes(username),
});

const dustObj = (wortArr, username) => {
  let dustobj = {}
  wortArr.forEach(wort => { // alle Worte durchlaufen
    if (!wort || !wort.wort)  return;
    dustobj[wort.wort] = dust(wort, username)
  });
  // console.log({dustobj});
  return dustobj
};

const wortStat = user => {
  // DB-Abfrage
  const { loading, error, data } = useQuery(GET_USER_WORTE, {
    variables: {username: user.username}
  })
  if (loading) return 'Lädt...';
  if (error) return `Graphql-Fehler: ${error.message}`;
  let wortArr = data.getUserWorte;
  if (!wortArr) {
    console.log("Keine Worte gefunden! (detWort.js query GET_USER_WORTE");
    return null;
  }
  // Daten gefunden
  const stopworte = user.stopworte.map(wo => wo.wort);
  const loops = 5;
  const uebstatinit = uebStatInit(wortArr, stopworte);
  const detstatinit = detStatInit(wortArr, stopworte);
  const uebObj = rtgObj(uebstatinit, loops);  // {wort: {worte, satze, nonstopworte, usedSets, ebenewort, nsworteZahl, satzeZahl}, {}, ...}
  const detObj = rtgObj(detstatinit, loops);
  const statObj = combineSubObj({ueb: uebObj, det: detObj}, true);  // {wort: {ueb-worte, ueb-satze, ...}, {}, ...}
  const dustobj = dustObj(wortArr, user.username);
  let wortstat = combineSubObj({stat: statObj, dust: dustobj}, null);
  wortstat = {...wortstat, groupstat: objsubstat(wortstat)}
  console.log({wortstat});
  return wortstat;
};

// kein gql für graphql-hooks!
const GET_USER_WORTE = `
  query($username: String!) {
    getUserWorte(username: $username) {
      _id
      wort
      satz(input: {username: $username}) {
        _id 
        worte {
          _id
      		wort
        }
        wort {
          _id
          wort
        }
        typ {
          _id
          wort
        }
      }
      satze(input: {username: $username}) {
        _id 
        wort {
          _id
          wort
        }
        worte {
          _id
      		wort
        }
        typ {
          _id
          wort
        }
      }
      stopuser
      typuser
      color
      username
    }
  }
`;

export default wortStat;

