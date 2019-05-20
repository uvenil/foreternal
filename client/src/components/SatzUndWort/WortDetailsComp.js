import React from "react";
import SatzKurzListe from "./SatzKurzListe";

const WortDetails = ({ children, satz: { wort: { wort, satz, satze } }, ...props} ) => (
  <div className="App" style={{ width: "100%", border: "5px solid green", position:"relative" }}>
    {children}
    <h3 className="main-title details__head" style={{color:"green"}}>
      {'Wort: "'+wort+'"'}  
    </h3>
    <h4>Details: (beschreibt)</h4>
    <SatzKurzListe {...props} satzListe={satz}/>
    <hr></hr>
    <h4>Überblick: (enthalten in)</h4>
    <SatzKurzListe {...props} satzListe={satze}/>
  </div>
);

export default WortDetails;
