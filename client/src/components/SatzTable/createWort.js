import React from "react";
import { useQuery } from 'graphql-hooks';
import {worteVonSatze} from "./../../util/formatSatze";

const wortObjekt = wort => {
  if (wort.wort)  return wort;  // bereits wort-Objekt
  // ggf wort in wort-Objekt umwandeln
  let {worte} = this.props.userdata
  let {satze} = this.props.userdata;
  const wortObj = (worte && worte[wort])?
    worte[wort]:
    worteVonSatze(satze)[wort];
  if (wortObj)  return wortObj;
  console.log("Es konnte kein wort-Objekt gefunden werden! (createWort.js, Fkt wortObjekt)")
  return wort;
};

const createClickWort = (handleClick, zid, strongs) => (wort, typ, key) => (
  // console.log({handleClick, zid, wort, typ}) ||
  <a
    key={key}
    onClick={() => handleClick.left(wort, typ, zid)}
    onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ, zid); }}
    style={{fontWeight:strongs.includes(wort)? 600: 400}}
    >
    {wort + " "}
  </a>
);

const relatstat = (wortstr, wortstat) => {
  const wortstats = wortstat[wortstr];
  const groupstats = wortstat["groupstat"];
  let relstat = {};
  for (let key in groupstats) {
    relstat[key] = wortstats[key] / groupstats[key].max
  }
  return relstat;
};

const wortFilter = (wortstat, filterfkt) => {
  if (!wortstat)  return false;
  // filterfkt: {d: d=>true, u: u=>true, s: s=>true, t: t=>true}, // alles anzeigen
  let wortfilter = true;
  for (let x in filterfkt) {
    // console.log(x, ": ", wortstat[x]);
    if (!filterfkt[x](wortstat[x])) wortfilter = false;
    if (!wortfilter)  break;
  }
  return wortfilter;
};

const createWort = (handleClick, zid, user, wortstat, filterfkt, strongs) => 
  (wort, typ, key) => {
  // user=false als Zeichen, dass einfaches ClickWort verwendet werden soll, keine Wortinfo
  if (user===false)   return createClickWort(handleClick, zid, strongs)(wort, typ, key)
  // DB-Abfrage
  // wort = wortObjekt(wort);
  const { loading, error, data } = useQuery(GET_WORT, {
    variables: {wort}
  })
  if (loading) return 'Lädt...'
  if (error) return `Graphql-Fehler: ${error.message}`
  if (!data.wort)   return createClickWort(handleClick, zid)(wort, typ, key)
  // Daten gefunden
  // console.log({strongs});
  const {d, u, s, t} = wortstat[wort]? wortstat[wort]: {};
  const dust = {d, u, s, t};
  // const dust = dustObj(data.wort, user.username, wortstat);  // {d, u, s, t}, Anz. Details, Anz. Überschriften, isStop, isTyp,  evtl.aus wortstat[wort] ziehen
  let wortstr = ` ${dust.t? "|": ""}${wort}${dust.s? "'": ""} `;
  const relstat = relatstat(wort, wortstat);
  if (dust.d===1)  typ = data.wort.satz[0].typ;
  if (wortstat[wort]) {
    wortstr = wortstat[wort]["ueb-nsworteZahl"]>=0? wortstat[wort]["ueb-nsworteZahl"] + wortstr: wortstr;
    wortstr = wortstat[wort]["det-nsworteZahl"]>=0? wortstr + wortstat[wort]["det-nsworteZahl"]: wortstr;
  }
  return (
    !wortFilter(wortstat[wort], filterfkt)? null:
    // console.log({handleClick, zid, wort, typ}) ||
    <div
      style={{display:"inline-block", paddingLeft:"5px"}}
      key={key}
    >
      { !dust.u>0 || dust.s? null:  // oberer Balken -> Überblick
      <div 
        style={{height:(relstat.u*8)+"px", backgroundColor:"lightblue", width:"90%", margin:"auto"}}
      ></div>
      }

      <a
        onClick={() => handleClick.left(wort, typ, zid)}
        onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ, zid); }}
        style={{fontWeight:strongs.includes(wort)? 600: 400}}
      >
        {/* { console.log({wort}, wortstat[wort]["ueb-nsworteZahl"]) ||
          wortstat[wort] && !wortstat[wort]["ueb-nsworteZahl"]>=0? wortstat[wort]["ueb-nsworteZahl"] + wortstr + wortstat[wort]["det-nsworteZahl"]: wortstr} */}
        {wortstr}
      </a>

      { !dust.d>0? null:  // unterer Balken -> Details
      <div 
        style={{height:dust.d+"px", backgroundColor:"black", width:"90%", margin:"auto"}}
        // style={{height:(relstat.d*10)+"px", backgroundColor:"black", width:"90%", margin:"auto"}}
      ></div>
      }
    </div>
  );
}

// kein gql für graphql-hooks!
const GET_WORT = `
  query ($wort: String) {
    wort(wort: $wort) {
      _id
      wort
      satz {
        _id 
        typ 
        {_id wort}
      }
      satze {_id}
      stopuser
      typuser
      color
      username
    }
  }
`;

export default createWort;

