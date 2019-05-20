import React from "react";
import SatzEintrag from "./SatzEintrag";

import Satztypenfarben from "../HOC/Satztypenfarben";
// const SatzEintragTyp = withSatztypenfarben(SatzEintrag);

const SatzListe = ( {satzListe} ) => (
  <div className="App table-wrapper">
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
        {satzListe.map(satz => (
          <Satztypenfarben key={satz._id}  {...satz}>
            {({refetch, satztypenfarben, ...satz, ...props}) => (
              <SatzEintrag {...props} refetch={refetch} satztypenfarben={satztypenfarben} {...satz} />
            ) }
          </Satztypenfarben>
        ))}
      </tbody>
    </table>
  </div>
);

export default SatzListe;
