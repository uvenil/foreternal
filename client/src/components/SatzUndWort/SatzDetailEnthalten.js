import React from "react";
import SatzTypenEintrag from "./SatzTypenEintrag";
import untersatzTypen from "../../util/untersatzTypen";

const SatzDetailEnthalten = ({ satz, ...props} ) => {
  // Typen der satze, in denen die basissatz-worte vorhanden sind, ermitteln
  // console.log({satz});
  const satzetypen = untersatzTypen.satzeTypen(satz);
  // Rückgabewert
  return (
    <div className="App table-wrapper">
      <table style={{border: 1}}>
        <colgroup>
          {(()=>{  // pro Spalte abwechselnde Grau-Töne
            let cols = [];
            let colnumber = satzetypen.length + 1; // 1. Spalte ist der Basissatz mit den Überschriften
            for (let i = 0; i < Math.floor(colnumber/2); i++) {
              cols.push(
                <col key={i * 2} style={{ backgroundColor: '#ddd' }}></col>,
                <col key={i * 2 + 1} style={{ backgroundColor: '#eee' }}></col>
              );
            };
            if (colnumber % 2 > 0) cols.push(
              <col key={"lastcol"} style={{ backgroundColor: '#ddd' }}></col>
            );
            return cols;  // Array als Rückgabewert funktioniert
          })()  // selbstaufrufende Funktion
          }
        </colgroup>
        <thead>
          <tr>
            <th>Satztypen</th>
            {Array.isArray(satzetypen)? satzetypen.map(typ=>(
              <th key={typ}>{typ}</th>
            )) : null}
          </tr>
        </thead>
        <tbody>
          <SatzTypenEintrag {...props} typen={satzetypen} basissatz={satz} wort={satz.wort} />
          {satz.worte ? ( 
            satz.worte.map((wort, ix) => (
              <SatzTypenEintrag {...props} key={wort._id + ix} typen={satzetypen} basissatz={satz} wort={wort} />
          ))) : null
          }
        </tbody>
      </table>
    </div>
  );
}

export default SatzDetailEnthalten;
