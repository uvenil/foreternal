// kopiert und modifiziert von SatzGitter.js

import React from "react";
import zyklen from "./zyklen";
import { CellFold, Grid } from "./../CellFold";

const initialState = {
  gitter: [3, 1], // [y, x]
  // maxWorte: 20,    // maximale Anzahl darzustellender Worte pro Satz
};

class Zyklus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: JSON.parse(value) });
  };

  handleAlleChange = event => {
    let { name, value } = event.target;
    value = JSON.parse(value);
    let {gitterzellen} = this.state;
    gitterzellen = gitterzellen.map(zeile => {
      return zeile.map(zelle => ({...zelle, [name]:value}));
    })
    this.setState({ gitterzellen, [name]: value }); // Variable im Zyklus state und in den state der einzelnen Zellen ändern
  };

  satzvonwort = (wort, typ, satze = this.props.userdata.satze) => {
    let satzArr = satze.filter(satz => {
      return (satz.wort._id === wort._id) && (satz.typ.wort === typ.wort);
    });
    if (satzArr.length===0) { // Wort und Typ nicht vorhanden => nur nach Wort suchen
      satzArr = satze.filter(satz => satz.wort._id === wort._id);
    }
    let satz;
    switch (satzArr.length) {
      case 0:
      alert(`Leider kein Satz mit der Überschrift "${wort.wort}" gefunden!`);
      return null;
      case 1:
      satz = satzArr[0];
      break;
      default: // !!! was ist bei mehreren Treffern -> Auswahl erstellen
      satz = satzArr[Math.floor(Math.random()*satzArr.length)];  // Zufallselement aus dem Array auswählen,   Alternative: satz = satzArr[0];
    }
    console.log("satz", satz);
    return satz;
  }

  render() {
    let {zyklus, handleClick, satze, userdata} = this.props;
    zyklus = zyklus || "tableedit";
    satze = satze || userdata.satze;
    if (!zyklen || !zyklen.hasOwnProperty(zyklus)) {
      console.log(`Zyklus.js: zyklus "${zyklus}" ist nicht vorhanden!`);
      return null;
    }
    this.cyclecomps = zyklen[zyklus]({handleClick, satze, userdata}).comps;
    // console.log("Zyklus userdata", userdata);
    // console.log("this.cyclecomps", this.cyclecomps);
    const { gitter } = this.state; //
    // Areas ermitteln
    const zeilen = [...Array(gitter[0]).keys()];  // y
    const spalten = [...Array(gitter[1]).keys()]; // x
    let zeilenarr, zelle, comp;
    const areas = zeilen.map(zeile => {
      zeilenarr = spalten.map(spalte => `a${zeile}${spalte}`);
      return zeilenarr.join(" ");
    });
    // console.log("this.state", this.state);
    return (
      <Grid
        columns={1}
        rows={"1fr auto auto"}
        gap="2px"
        style={{ border: "2px solid grey", margin: "auto" }}
        areas={areas}>
        {
          zeilen.map(ze => {
            return spalten.map(sp => {
              zelle = `a${ze}${sp}`;
              comp = this.cyclecomps.find(c => c.zelle===zelle && c.visible);  // in dieser Zelle aktuell anzuzeigende componente
              if (!comp)  comp = this.cyclecomps.find(c => c.zelle===zelle && !c.visible);  // in dieser Zelle aktuell anzuzeigende componente
              if (!comp) return null;
              let {alternativ, Component, props, visible} = comp;
              // console.log(zelle, " ",ze, " ", sp, " ", zix);
              return (
                <CellFold key={zelle} summary={zelle} area={zelle}>
                  {!visible? alternativ: (
                    <Component {...props}  {...this.props}/>
                  )}
                </CellFold>

              );
            });
          })
        }
        {/* <CellFold summary={"Gittersteuerung"} display="flex" alignItems="flex-start" flexDirection="row-reverse" justifyContent="flex-start"> */}
        {/* <div style={{fontSize:"0.7rem", textAlign:"right"}}>
          <label htmlFor="gitter">Gitteranordnung [Zeilen, Spalten]: </label>
          <select
            name="gitter"
            onChange={this.handleChange}
            value={JSON.stringify(this.state.gitter)}
          >
            {[[2,1], [3,1], [4,1], [5,1], [1,2], [2,2], [3,2], [4,2], [1,3], [2,3], [3,3]].map(az => {
              az = JSON.stringify(az)
              return (
                <option key={az} value={az}>{az}</option>
              )
            })}
          </select>
          <label htmlFor="maxWorte">Maximale Wortanzahl pro Satz</label>
          <input
            min="0"
            name="maxWorte"
            onChange={this.handleAlleChange}
            style={{width:"2.5rem"}}
            type="number"
            value={this.state.maxWorte}
          />
        </div> */}
        {/* </CellFold> */}
      </Grid>
    );
  }
}

export default Zyklus;