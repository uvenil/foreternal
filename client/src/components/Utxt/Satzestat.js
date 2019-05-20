import React, {Fragment} from "react";
import Zyklus from "./Zyklus";
import { Fold } from "./../CellFold";
import {
  keySet,
  modobjval,
  objKeySet,
  objTable,
  objTiefe,
  subobj, 
  valueSet,
} from "./../../util/objutils";
import {
  haeuf,
  haeufigkeit, 
  haeufString,
  roundnr, 
  statStr, 
  statString,
} from "./../../util/stat";
// import Obj from "./../../util/Obj"

const satzeStat = satze => {
  if (!satze || !satze.length>0) {
    console.log("Fkt. satzeStat: Keine Satze vorhanden!");
    return null;
  }
  let Satztypen = haeufigkeit(satze, ["typ", "wort"]);
  const Überschriften = haeuf(satze.map(s=>s.wort.wort).sort());
  Satztypen = {_gesamt: satze.length, ...Satztypen};
  const modFkt = x => Math.max(0, roundnr(x));
  const Allgemein = {
    "Worte pro Satz": statStr(satze.map(s=>s.worte.length), modFkt), 
  };
  return {
    Allgemein,
    Überschriften,
    Satztypen,
  };  // satzeStat-Objekt mit keys als Tabellenüberschriften
};

// const statStr = sw => `${sw.min}:${sw.mu}|${sw.mw}|${sw.mo}:${sw.max}`; // sw = statwerte,  jetzt: stat.js statString

const worteStat = (userdata) => {
  if (!userdata || !userdata.wortstat || !userdata.wortstat.groupstat) {
    console.log("Fkt. worteStat: Kein wortstat vorhanden!");
    return null;
  }
  let wortestat = {};
  let wortehaeuf = {};
  const {groupstat} = userdata.wortstat;
  // console.log({groupstat});
  // Object.keys(groupstat).forEach(key => {
  //   wortestat[key] = modobjval(groupstat[key], x => Math.max(0, roundnr(x)));
  //   wortehaeuf[key] = haeufString(groupstat[key]["haeuf"])
  // });
  // wortestat = modobjval(wortestat, statString);
  Object.keys(groupstat).forEach(key => {
    // wortestat[key] = {...groupstat[key]}; 
    wortestat[key] = modobjval(groupstat[key], x => Math.max(0, roundnr(x)));
    wortehaeuf[key] = {...groupstat[key]["haeuf"]};
    delete wortestat[key]["haeuf"];
  });
  return {wortestat, wortehaeuf};  // worteStat-Objekt mit keys als Tabellenüberschriften
};

const userStats = (satze, userdata) => {
  if (!satze || !satze.length>0) {
    console.log("Fkt. userStats: Keine Satze vorhanden!");
    return null;
  }
  let users = valueSet(satze, "username");
  let {username} = userdata.user;
  let usersatze;
  const stat = {};
  if (username==="admin") {
    stat.admin = satzeStat(satze);
  }
  users.forEach(name => {
    usersatze = satze.filter(s => s.username===name);
    stat[name] = satzeStat(usersatze);
  });
  console.log({stat});
  return stat;  // stat = {username1: satzeStat1, username2: satzeStat2, ...}
};

const parrowAllg = (par, users, stat) => {  //  Tabellenzeile(n) mit Parametern (für Objekte recursiv mehrere Zeilen)
  if (!Array.isArray(par))  par = [par];
  par = par.flat();
  const key = par.slice(-1);
  const keyset = keySet(users.map(username => subobj(stat[username], par)));
  return (
    !keyset? // erster User zeigt Datenstruktur aller user
    // primitive Werte
    <tr key={key} >
      <td>{key}</td>
      {users.map(username => 
        <td key={par+username}>{
          // Obj(stat[username][par])
          // JSON.stringify(subobj(stat[username], par), null, 2)
          roundnr(subobj(stat[username], par), 0)
        }</td>
      )}
    </tr>:
    // Objekt wird nach keys aufgeschlüsselt (1 Zeile pro key)
    <Fragment  key={key}>  
      <tr>
        <td>
          <strong>
           {par.slice(-2, 1)}
          </strong>
        </td>
      </tr>
      {[...keyset].sort().map(key => (
        parrowAllg([par, key], users, stat)
      ))}
    </Fragment>
  );
};

const Kopfzeile = ({users}) => (
  <tr>
    <th>Statistik / User</th>
    {users.map(username => <th key={username}>{username}</th>)}
  </tr>
);

const headKey = par => ({
  key: par.slice(-1)[0],  // aktueller key ist letztes Attribut
  headkey: par.length>1? par.slice(-2)[0]: null,  // aktueller headkey ist vorletztes Attribut, wenn es existiert
})

// !!! hier: weitere Parameter und schöner darstellen
class Satzestat extends React.Component {
  constructor(props) {
    super();
    const {satze, userdata} = props
    const {satztypen} = userdata.user;
    this.satztypen = new Set(Object.keys(satztypen));
    this.userstats = userStats(satze, userdata);
    this.users = Object.keys(this.userstats);
    this.state = { satze };
  }

  componentDidMount() {
    const satze = this.props;
    this.setState(satze);
  }

  handleClick(par, username) {
    const {key, headkey} = headKey(par);
    console.log({key});
    console.log({headkey});
    let satze = this.props.satze; // oder prevState?
    if (username!=="admin") {
      satze = satze.filter(s => s.username===username);
    }
    // satze nach key filtern
    if (headkey==="Satztypen" && key!=="_gesamt") {
      if (![...this.satztypen].includes(key))   return;
      satze = satze.filter(s => s.typ.wort===key);
    } else if (headkey==="Überschriften") {
      satze = satze.filter(s => s.wort.wort===key);
    } 
    this.setState(prevState => ({satze}));
  }

  rowstyle(key) {
    const {satztypen} = this.props.userdata.user;
    let color = this.satztypen.has(key)? satztypen[key]: "inherit";
    let fontWeight = key==="_gesamt"? 600 : "normal";
    return {color, fontWeight};
  }

  parrow = (par) => {  //  Parameterreihe, Tabellenzeile(n) mit Parameter-Werten (für Objekte recursiv mehrere Zeilen)
    if (!Array.isArray(par))  par = [par];
    par = par.flat(); // Array mit keys
    const {key, headkey} = headKey(par);
    const keyset = keySet(this.users.map(username => subobj(this.userstats[username], par)));
    return (
      !keyset? // erster User zeigt Datenstruktur aller user
      // primitive Werte
      <tr 
        key={key} 
        style={this.rowstyle(key)}
      >
        <td>{key}</td>
        {this.users.map(username => 
          <td
            key={par+username}
          >
            {/* {(!this.satztypen.has(key) && key!=="_gesamt")? */}
            {!["Überschriften", "Satztypen"].includes(headkey)?
            roundnr(subobj(this.userstats[username], par), 0):
            <a
              onClick={()=>this.handleClick(par, username)}
            >
              {/* Obj(this.userstats[username][par])
              JSON.stringify(subobj(this.userstats[username], par), null, 2) */}
              {roundnr(subobj(this.userstats[username], par), 0)}
            </a>}
          </td>
        )}
      </tr>:
      // Objekt wird nach keys aufgeschlüsselt (1 Zeile pro key)
      this.keySettable(keyset, par)
    );
  }
 
  keySettable = (keyset, par) => (  // ruft wechselseitig this.parrow auf
    <Fold 
      key={par.slice(-1)[0]}  // key ist letztes Attribut
      summary={par.slice(-2, 1)}
    >
      <table >
        <colgroup>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
        </colgroup>
        <thead>
          <tr>
            <td style={{backgroundColor:"white", border:"none", color:"grey", textDecoration: "underline grey"}}>
              <strong>
                {par.slice(-2, 1) // vorletzter key ist Tabellenname
                } 
              </strong>
            </td>
          </tr>
          <Kopfzeile users={this.users}/>
        </thead>
        {/* Attribute */}
        <tbody>
          {[...keyset].sort().map(key => (
            this.parrow([par, key])
          ))}
        </tbody>
      </table>
    </Fold>
  )

  // !!! hier: nested Satzabfrage um Verknüpfungsgrad, etc. zu bestimmen
  render() {
    // if (!this.state || !this.state.satze)  return null;
    const {satze} = this.state;
    // console.log({satze});
    const {handleClick, userdata} = this.props;
    const params = keySet(this.users.map(u => this.userstats[u])); // Statistik pro user
    const {wortestat, wortehaeuf} = worteStat(userdata) || {}; // {wortestat:null, wortehaeuf:null};
    return (
      <div className="App table-wrapper">
        {!(satze && satze.length>0)?
          <p>Es sind noch keine Sätze vorhanden. Bitte anlegen unter SatzEingabe oder TextEingabe. Vorher ggf. anmelden oder registrieren!</p>:
          <div style={{width:"100%"}}>
            <div style={{display:"flex"}}>
              {[...params].map(par => this.parrow(par))}
            </div>
            <hr/>
            <Zyklus {...this.props}
              zyklus="tableedit"
              handleClick={handleClick} 
              satze={satze}
              // satze={satze.map(satz => ({
              //   ...satz,
              //   groups: {wortelen: satz.worte.length}
              // }))}
              userdata={userdata}
            />
            <hr/>
            <div>
              { console.log({wortestat}) ||
                !wortestat? null: objTable(wortestat, "wortestat")
              }
            </div>
            {/* <div>
              { console.log({wortehaeuf}) ||
                !wortehaeuf? null: objTable(wortehaeuf, "wortehaeuf")
              }
            </div> */}
          </div>
        }
      </div>
    );
  }
}

export default Satzestat;
