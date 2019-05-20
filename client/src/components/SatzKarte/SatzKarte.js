import React from "react";

import SatzKopf from "./../SatzKarte/SatzKopf";
import SatzZellUeListe from "./SatzZellUeListe";  // Überschriften
// import SatzZellListe from "./../common/SatzZellListe";      // Überschriften + Satze
import { CellFold, Grid } from "./../CellFold";
import satzListe from "../../util/satzListe";
import Zyklus from "./../Utxt/Zyklus";



const SatzKarte = ({ 
  children,
  handleChange, 
  handleClick, 
  rtg, 
  satz, 
  satztypen, 
  subtyp, 
  tiefe, 
  userdata,
  ...props 
}) => {
  const stopworte = userdata.user.stopworte.map(wo => wo.wort);
  return (
    <Grid
      columns={"auto auto 1fr"}
      rows={"auto 1fr"}
      gap="2px"
      areas={[
        "kopf satz zelle",
        "sub sub sub"
      ]}
      style={{
        backgroundColor: "#eee",
        border: "2px solid lightgrey",
        boxShadow: "-3px 3px 5px 0px rgba(168, 168, 168, 0.7)",
        margin: "0.2rem",
        position: "relative",
      }}
    >
      {/* {(()=>{
        console.log("SK props", props);
      })()} */}
      <CellFold summary="Satz: Überschrift, Typ" area="kopf" style={{ position: "relative" }}>
        <SatzKopf {...props} 
          handleClick={handleClick} 
          handleChange={handleChange}
          rtg={rtg} 
          satz={satz} 
          satztypen={satztypen} 
          subtyp={subtyp} 
          tiefe={tiefe}
        />
      </CellFold>
      <CellFold area="zelle" summary="Zellstrg" style={{ position: "relative" }}>
        {children   // this.props.children zum EInfügen der ZellSteuerung in SatzZelle.js
        }
      </CellFold>
      {(tiefe>1 && tiefe<5) &&  // Basissatz
        <CellFold center middle summary="Basissatz" area="satz" style={{ color: `${satztypen[satz.typ.wort]}` }}>
          <h3 style={{ border: `2px solid ${satztypen[satz.typ.wort]}`, margin: "0 auto", padding: "0.3rem" }}>
            {satz.worte && satz.worte.map((wort, ix) => (
              <a
                key={wort._id + ix}
                onClick={() => handleClick.left(wort, satz.typ, props.zelleid)}
                onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, satz.typ); }}
              >
                {wort.wort + " "}
              </a>
            )
            )}
          </h3>
        </CellFold>}
      {tiefe===3 &&   // Untersätze Überchriften
        <CellFold center middle summary="Untersätze" area="sub">
          <SatzZellUeListe {...props} 
            handleChange={handleChange}
            handleClick={handleClick}
            satzListe={rtg==="Details" ? satzListe.detail(satz, subtyp, stopworte, false) : satzListe.ueberblick(satz, subtyp, stopworte)}
          />
        </CellFold>}
      {/* {tiefe>3 &&   // Untersätze Satze
        <CellFold center middle summary="Untersätze" area="sub">
          <SatzZellListe {...props} 
            ersteZeile={tiefe===4 ? false : true}
            handleChange={handleChange}
            handleClick={handleClick}
            satzListe={rtg==="Details" ? 
              satzListe.detail(satz, subtyp, stopworte, tiefe===4 ? false : true) : 
              satzListe.ueberblick(satz, subtyp, stopworte, tiefe===4 ? false : true)}
            satztypen={satztypen}
          />
        </CellFold>} */}

      {tiefe>3 &&   // Untersätze Satze
        <CellFold center middle summary="Untersätze" area="sub">
          <Zyklus 
            ersteZeile={tiefe===4 ? false : true}
            handleChange={handleChange}
            handleClick={handleClick} 
            satze={rtg==="Details" ? 
              satzListe.detail(satz, subtyp, stopworte, tiefe===4 ? false : true) : 
              satzListe.ueberblick(satz, subtyp, stopworte, tiefe===4 ? false : true)}
            userdata={userdata}
            zid={props.zelleid}
            zyklus="tableedit"
          />
        </CellFold>}
    </Grid>
  );
}

export default SatzKarte;
