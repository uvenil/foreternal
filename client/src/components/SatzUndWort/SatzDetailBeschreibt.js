import React from "react";
import SatzListenEintrag from "./SatzListenEintrag";

const SatzDetailBeschreibt = ({ satz, ...props} ) => {
  // maximale Anzahl der satze ermitteln, die ein basissatz-wort überschreibt
  // console.log("B satz", satz.wort.wort);
  // console.log("B props", props);
  
  let { wort, worte } = satz;
  let maxLen = wort.satz.filter(sa => sa._id !== satz._id).length;
  worte.forEach(wort => {
    maxLen = Math.max(maxLen, wort.satz.filter(sa=>sa._id!==satz._id).length);
  });
  // Rückgabewert
  return (
    <div className="App table-wrapper">
      {
        (() => {
          // console.log("satz", satz);
        })()
      }
      <table style={{border: 1}}>
        <colgroup>
          {(() => {  // pro Spalte abwechselnde Grau-Töne
            let cols = [];
            cols.push(<col key={"firstcol"} style={{ backgroundColor: '#ddd' }}></col>);
            for (let i = 0; i < maxLen; i++) {
              cols.push(
                <col key={i * 2 + 1} style={{ backgroundColor: '#eee' }}></col>,
                <col key={i * 2} style={{ backgroundColor: '#ddd' }}></col>
              );
            };
            return cols;  // Array als Rückgabewert funktioniert
          })()  // selbstaufrufende Funktion
          }
        </colgroup>
        <thead>
          <tr>
          {(() => {  // pro Spalte abwechselnde Grau-Töne
            let heads = [];
              heads.push(<th key={"firstcol"}>Wort</th>);
              for (let i = 0; i < maxLen; i++) {
                heads.push(
                  <th key={i * 2 + 1}>Satz</th>,
                  <th key={i * 2}>Typ</th>
                );
              };
              return heads;  // Array als Rückgabewert funktioniert
            })()  // selbstaufrufende Funktion
            }
          </tr>
        </thead>
        <tbody>
          <SatzListenEintrag {...props} basissatz={satz} wort={satz.wort} />
          {satz.worte ? ( 
            satz.worte.map((wort, ix) => (
              <SatzListenEintrag {...props} key={wort._id + ix} basissatz={satz} wort={wort} />
          ))) : null
          }
        </tbody>
      </table>
    </div>
  );
}

export default SatzDetailBeschreibt;
