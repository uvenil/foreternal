import React from "react";
import SatzDetailBeschreibt from "./SatzDetailBeschreibt";
import SatzDetailEnthalten from "./SatzDetailEnthalten";

const SatzDetails = ({ children, satz, ...props} ) => {
  return(  
    <div className="App" style={{width: "100%", border: "5px solid blue", position:"relative" }}>
      {
        (() => {
          // console.log("satz", satz);
          // console.log("props", props);
        })()
      }
      {children}
      <h3 className="main-title details__head" style={{ color: "blue", textAlign:"center" }}>
        <div>
          {`Satz: "${satz.wort.wort}"`}
        </div>
        <div>
          {`Satztyp: ${satz.typ.wort}`}
        </div>
      </h3>
      <h4>Details: (beschreibt)</h4>
      <SatzDetailBeschreibt {...props} satz={satz} />
      <hr></hr>
      <h4>Überblick: (enthalten in)</h4>
      <SatzDetailEnthalten {...props} satz={satz} />
    </div>
  );
};


// !!! hier: 
// evtl. push to wort/surf/id
// evtl. Trennung von Wort-Surf und Satz-Surf
// WortDetails kompakter machen
// längstes Wort im Satz als Default-Überschrift
// Beispieldaaten nur bei leerer Datenbank importieren
// Typen-Links
// Tabelle scroll

// Mit flex statt mit Tabellen surfen
// Gruppierung von Sätzen und Worten
// Worte anclickbar
// bei mehreren Satz-Treffern -> Auswahl erstellen
// Hover-Wortsteuerung: Welcher Satz, Satztyp, welche Sätze

export default SatzDetails;
