import React from "react";
import withQuery from "./../HOC/withQuery";
import KreuzWort from "./../KreuzWort/KreuzWort";
import SatzKarte from "./../SatzKarte/SatzKarte";
import SatzZelle from "./SatzZelle";
// import SatzUndWort from "./../SatzUndWort/SatzUndWortComp";
import SatzDetails from "./../SatzUndWort/SatzDetailsComp";
import WortDetails from "./../SatzUndWort/WortDetailsComp";
import { GET_SATZ_NESTED } from "../../queries";  // ggf. GET_WORT_NESTED, 
import { CellFold, Grid } from "./../CellFold";
import {worteVonSatze} from "./../../util/formatSatze";

const initialState = {
  anzahlzellen: [3, 1], // [y, x]
  components: [KreuzWort, SatzKarte, SatzDetails, WortDetails], // , SatzUndWort;  in der SatzZelle darzustellende Komponente
  gitterloaded: false,
  maxWorte: 20,    // maximale Anzahl darzustellender Worte pro Satz
  verbindungsfkt: (x, y) => { // berecshnet den an der x,y-Position darzustellenden Satz
    return this.state.xsatze[x].worte[y].wort.wort;
  },
  satzzellen: [[],[],[],[]],// satzzellen[y][x] mit satz.__id,  satzzellen[y] = Zeile y an Satzen 
};

const initZelleState = {
  compix: 1,      // Index der darzustellenden Rechercheeinheit (-Komponente)
  maxWorte: initialState.maxWorte,    // maximale Anzahl darzustellender Worte pro Satz
  // maxWorte: 20,    // maximale Anzahl darzustellender Worte pro Satz
  rtg: "Details", // Rechercherichtung: Details (satz): von Überschrift zu Satzen (satz.worte), Überblick (satze): von Satzinhalt (satz.worte) zu Überschriften
  satz: {},       // Satz mit Details
  satzId: 0,      // darzustellender Basissatz
  subtyp: "Satztyp", // darzustellender Sub-Satztyp
  tiefe: 9,       // darzustellende Tiefe (Detailgrad) (1 = Überschrift, 2 = Satz, 3 = Untersatz-Überschriften, 4 = Untersatz-Satze)
  zelleid: [0,0], // y, x
  zelleloaded: false
}

class SatzGitter extends React.Component {
  constructor(props) {
    // console.log("props", props);
    super(props);
    this.state = { ...initialState };
  }

  componentDidMount() {
    console.log("p", this.props);
    const {userdata} = this.props;
    const { satz, user } = userdata;
    const storageName = `${user.username}_satzgitter`;
    // Einstellungen ggf. aus usercache localStorage laden
    const usercache = ""; // alternativ:
    // const usercache = localStorage.getItem(storageName);  // username als kex (unique)
    let {satzzellen} = this.state;
    if (usercache) {
      satzzellen = JSON.parse(usercache);
    } else {
      if (!satz)  return;
      satzzellen[0][0] = {...initZelleState, satzId:satz._id};
      localStorage.setItem(storageName, JSON.stringify(satzzellen));
    }
    this.setState({
      satzzellen,  // satzzellen[y][x] mit zelleState,  satzzellen[y] = Zeile y an Satzen 
      storageName, // Name unter dem in localStorage gespeichert wird
    }, () => {
      this.setState({ gitterloaded: true });  // loaded = Zeichen, dass man sich auf den state verlassen kann
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: JSON.parse(value) });
  };

  handleAlleChange = event => {
    let { name, value } = event.target;
    value = JSON.parse(value);
    let {satzzellen} = this.state;
    satzzellen = satzzellen.map(zeile => {
      return zeile.map(zelle => ({...zelle, [name]:value}));
    })
    this.setState({ satzzellen, [name]: value }); // Variable im SatzGitter state und in den state der einzelnen Zellen ändern
  };

  handleZelleChange = (event, zelleid, satz) => {
    const { name, value } = event.target;
    let {satzzellen} = this.state;
    let zellState = satzzellen[zelleid[0]][zelleid[1]];  // alter Zell-State
    zellState[name] = value;  // neuer Zell-State
    if (name === "satztyp") {
      const satzId = satz.wort.satz.find(satz => satz.typ.wort === value)._id;
      zellState = {...zellState, satzId, satz:{}, zelleloaded:true};
    }
    this.changezellestate(zellState);
  };

  changezellestate = (zellState) => {
    // console.log("zellState", zellState);
    const zelleId = zellState.zelleid;
    this.setState((prevState) => {
      let satzzellen = [...prevState.satzzellen];
      satzzellen[zelleId[0]][zelleId[1]] = zellState;
      localStorage.setItem(this.state.storageName, JSON.stringify(satzzellen));
      // console.log("satzzellen", satzzellen);
      return { ...prevState, satzzellen };
    });
  };

  satzvonwort = (wort, typ, satze) => {
    // console.log("typ", typ, "wort._id", wort._id);
    if (typeof typ!=="string")  typ = typ.wort;
    if (!satze) satze = this.props.userdata.satze;
    let satzArr = satze.filter(satz => {
      return (satz.wort._id === wort._id) && (satz.typ.wort === typ);
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

  leftClick = (wort, typ, zelleid) => { // Satz in nächster Zelle aufrufen
    if (!wort.wort) { // ggf wort in wort-Objekt umwandeln
      wort = (this.props.userdata.worte && this.props.userdata.worte[wort])?
      this.props.userdata.worte[wort]:
      worteVonSatze(this.userdata.satze)[wort];
    }
    console.log("(wort, typ, zelleid)", {wort, typ, zelleid});
    const satz = this.satzvonwort(wort, typ, this.props.userdata.satze);
    if (!satz)  return;
    const { anzahlzellen } = this.state;
    let nextid = [];
    nextid[1] = zelleid[1] + 1;
    if (nextid[1] >= anzahlzellen[1])  nextid[1] = 0; // Alle Zellen voll => Start von oben links
    nextid[0] = zelleid[0];
    if (nextid[1] === 0)  nextid[0] = nextid[0] + 1;
    if (nextid[0] >= anzahlzellen[0])  nextid = [0, 0]; // Alle Zellen voll => Start von oben links
    const zellState = {...this.state.satzzellen[zelleid[0]][zelleid[1]], satzId:satz._id, zelleid:[nextid[0], nextid[1]]};
    this.changezellestate(zellState);
  }

  render() {
    if (!this.props.userdata.satz) {
      return <p>Es wurde noch kein Satz ausgewählt. Bitte unter SatzListen oder SatzSuche durch Rechtsklick auf Wort Satz auswählen!</p>
    }
    const {userdata} = this.props;
    if (!this.state.gitterloaded) return null;
    let { handleClick } = this.props;
    handleClick = { ...handleClick, left: this.leftClick }; // Links-Klick austauschen
    const { anzahlzellen, components, satzzellen } = this.state; //
    // Areas ermitteln
    const zeilen = [...Array(anzahlzellen[0]).keys()];  // y
    const spalten = [...Array(anzahlzellen[1]).keys()]; // x
    let zeilenarr, zellid;
    const areas = zeilen.map(zeile => {
      zeilenarr = spalten.map(spalte => `a${zeile}${spalte}`);
      return zeilenarr.join(" ");
    })
    // console.log("this.state", this.state);
    return (
      <Grid
        columns={1}
        rows={"1fr auto auto"}
        gap="2px"
        style={{ margin: "auto" }}
        areas={areas}>
        {
          zeilen.map(ze => {
            if (!satzzellen[ze] || !satzzellen[ze][0]) return null;
            return spalten.map(sp => {
              zellid = `a${ze}${sp}`;
              return (
                satzzellen[ze][sp] && 
                <CellFold key={zellid} summary={zellid} area={zellid}>
                {
                  (() => {
                      const SatzZelleQ = withQuery(GET_SATZ_NESTED, { _id: satzzellen[ze][sp].satzId })(SatzZelle);
                      return (
                        <SatzZelleQ {...this.props} 
                          Component={components[satzzellen[ze][sp].compix]} 
                          compnames={components.map(c => c.name)}
                          handleZelleChange={this.handleZelleChange} 
                          handleClick={handleClick} 
                          userdata={userdata}
                          zelleState={satzzellen[ze][sp]} 
                        />);
                  })()
                }
                </CellFold>

              );
            });
          })
        }
        {/* <CellFold summary={"Gittersteuerung"} display="flex" alignItems="flex-start" flexDirection="row-reverse" justifyContent="flex-start"> */}
        <div style={{fontSize:"0.7rem", textAlign:"right"}}>
          <label htmlFor="anzahlzellen">Gitteranordnung [Zeilen, Spalten]: </label>
          <select
            name="anzahlzellen"
            onChange={this.handleChange}
            value={JSON.stringify(this.state.anzahlzellen)}
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
        </div>
        {/* </CellFold> */}
      </Grid>
    );
  }
}

export default SatzGitter;
