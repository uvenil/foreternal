import React from "react";
import SatzZellEintrag from "./SatzZellEintrag";

const SatzZellListe = ({ satzListe, satztypen, ersteZeile=false, ...props} ) => (
  (satzListe && satzListe.length>0) ? (
  <div className="App table-wrapper">
    <table>
      <colgroup>
        <col style={{backgroundColor: '#ddd'}}></col>
        <col style={{backgroundColor: '#eee'}}></col>
        <col style={{backgroundColor: '#ddd'}}></col>
      </colgroup>
      <thead>
        <tr>
          <th>Überschrift</th>
          <th>Satz</th>
          <th>Typ</th>
        </tr>
      </thead>
      <tbody>
        {satzListe ? (
          satzListe.map((satz, ix) => (
            <SatzZellEintrag {...props} 
              key={String(satz) + ix} 
              ersteZeile={(ersteZeile && ix===0)? true: false}  // ersteZeile-Wert ändert sich hier!
              satz={satz} 
              satztypen={satztypen}
            />
          )
        )) : null
        }
      </tbody>
    </table>
  </div>
  ) : <p>Keine Sätze vorhanden</p>
);

export default SatzZellListe;
