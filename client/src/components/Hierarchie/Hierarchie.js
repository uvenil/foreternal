import React from "react";
import Zyklus from "./../Utxt/Zyklus";

const Hierarchie = ({handleClick, loaddata, userdata}) => {
  if (loaddata)  loaddata();  // sofort laden, auskommentieren für Abfrage
  if (!(userdata.wort && userdata.wort.wort))  return 'Lädt...';
  const wortstat = userdata.wortstat[userdata.wort.wort];
  if (typeof wortstat!=="object") return 'Lädt...';
  const uebsatze = wortstat["ueb-satze"].map((arr, ix) => arr.map(s => ({
    str: s, groups: {rtg: "U", level: -(ix+1)}
  })));
  const detsatze = wortstat["det-satze"].map((arr, ix) => arr.map(s => ({
    str: s, groups: {rtg: "D", level: ix+1}
  })));
  let satze = [...uebsatze, ...detsatze].flat().map(s => {
    let [wortstr, typstr] = s.str.split("-");
    let satz = userdata.satze.find(sa => sa.wort.wort===wortstr && sa.typ.wort===typstr);
    let neusatz = {...satz, groups: s.groups};
    // console.log({neusatz});
    return neusatz;
  });

  return (
    <div>
      <strong>{userdata.wort.wort}</strong>
      <Zyklus 
        zyklus="tableedit"
        handleClick={handleClick} 
        satze={satze}
        strongs={[userdata.wort.wort]}
        userdata={userdata}
      />
    </div>
  );
}

export default Hierarchie;