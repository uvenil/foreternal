import React from "react";
import SatzKurzEintrag from "./SatzKurzEintrag";

const SatzKurzListe = ({ satzListe, ...props} ) => (
  <div className="App table-wrapper">
    <table style={{border: 1}}>
      <colgroup>
        <col style={{backgroundColor: '#ddd'}}></col>
        <col style={{backgroundColor: '#eee'}}></col>
        <col style={{ backgroundColor: '#ddd' }}></col>
      </colgroup>
      <thead>
        <tr>
          <th>Überschrift</th>
          <th>Satz</th>
          <th>Typ</th>
        </tr>
      </thead>
      <tbody>
        {
          satzListe ? (
            satzListe.map(satz => (
              <SatzKurzEintrag {...props} key={satz._id} {...satz} />
            ))
          ) : null
        }
      </tbody>
    </table>
  </div>
);

export default SatzKurzListe;
