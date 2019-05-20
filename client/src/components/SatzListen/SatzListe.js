import React from "react";
import SatzEintrag from "./SatzEintrag";

const SatzListe = ({ satze, ...props}) => (
  <div className="App table-wrapper">
    {!(satze && satze.length>0)?
      <p>Es sind noch keine Sätze vorhanden. Bitte anlegen unter SatzEingabe oder TextEingabe. Vorher ggf. anmelden oder registrieren!</p>:
      <table>
        <colgroup>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
        </colgroup>
        <thead>
          <tr>
            <th>Überschrift</th>
            <th>Satz</th>
            <th>Satztyp</th>
            <th>Gültigkeitsbedingung</th>
            <th>Erstellt</th>
            <th>Autor</th>
          </tr>
        </thead>
        <tbody>
          {satze.map(satz => (
              <SatzEintrag {...props} key={satz._id} {...satz} />
          ))}
        </tbody>
      </table>
    }
  </div>
);

export default SatzListe;
