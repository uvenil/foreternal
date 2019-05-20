import React from "react";
// import "./App.css";
// import SatzListe from "./SatzListe";
import SatzTable from "./../SatzTable/SatzTable";
// import UserData from "../UserData";


const SatzListen = ({handleClick, userdata, ...props}) => (
  <div className="App">
    <h1 className="main-title">
      <strong>Sätze</strong> Übersicht  
    </h1>
    <SatzTable {...props} 
      handleClick={handleClick}
      satze={userdata.satze}
      userdata={userdata}
    />
  </div>
);

export default SatzListen;
