import React from "react";
import Routes from "./Routes";
import {worteVonSatze} from "./../util/formatSatze";
import {Redirect} from "react-router-dom";

// setzt vor allem userdata.satze und .satz
class UserDat extends React.Component {

  componentDidMount() {
    let { satze, satz, set, user, worte } = this.props.userdata;
    if (!(satze && satze.length>0)) {
      // if ((!!satze && satze.length>0) && (!satz || (Object.keys(satz).length===0 && satz.constructor===Object))) { // test auf leeres Objekt
      console.log("UserDat.js cWM: Es wurden noch keine satze geladen!  satze = ", satze, "  username: ", user.username);
      return;
    } else {
    // console.log({satze});
    if (!worte) {
      worte = worteVonSatze(satze);
      set({worte});
    }
    const urlSatz = this.getUrlSatz();
    if (!satz) {  // satz setzen, wenn nicht vorhanden
      satz = urlSatz || satze[0];   // aus url oder den ersten Satz verwenden
      set({
        satz, 
        wort: satz.wort,
      });  // satz in userdata setzen
    }
  }
  }

  getSatzUrl = (satz=this.props.userdata.satz) => { // zukünftige satzurl bestimmen (url + satz._id = satzurl)
    // Satz aus userdata auslesen
    if (!satz) {
      console.error("getSatzUrl: Kein satz!  this.props.userdata.satz: ", satz);
      throw Error({ message:`getSatzUrl: Kein satz!  this.props.userdata.satz: ${satz}`});
    }
    if (!satz._id) {
      console.log("getSatzUrl: Keine satz._id!  this.props.userdata.satz: ", satz);
      return null;
    }
    // history.push, da satz vorhanden
    const {coreurl, history} = this.props;
    if (!coreurl || !history) {
      console.log("getSatzUrl: coreurl oder history nicht vorhanden => kein history.push!  with Router und with CoreUrl vorschalten.");
    } else {
      const satzurl = coreurl + satz._id; 
      // console.log("coreurl", coreurl);
      if (coreurl==="/")  return;
      console.log("+++ getSatzUrl: history.push zu : ", satzurl, "   Satztyp: ", satz.typ, "   Überschrift: ", satz.wort.wort);
      return satzurl;
    }
  }

  getUrlSatz = (satze=this.props.userdata.satze) => { // satz aus url auslesen (satze + url/satz._id => satz)
    let satz = null;
    if (!satze) {
      console.error("getUrlSatz: Vor Satz-Setzen Laden der Daten abwarten!");
      throw Error({ message:"getUrlSatz: Vor Satz-Setzen Laden der Daten abwarten!"});
    }
    // Satz_id ermitteln
    const urlId = this.getUrlId();
    // console.log("urlId", urlId);
    if (urlId) {
      satz = satze.find((satz) => satz._id===urlId) || null;
    } 
    if (!satz) {
      // console.log("getUrlSatz: Kein Satz gefunden!  urlId: ", urlId);
    }
    return satz;
  }

  getUrlId = () => { // benötigt zuvor withRouter (match, location)
    const {history, match, location} = this.props;
    // console.log("{history, match, location}", {match, location}, history);
    let urlId = null;
    // zuerst über match
    if (!match) {
      console.log("getUrlId: keine match-Variable! withRouter vorschalten.  match = ", match, ",   location = ", location, ",   history = ", history);
    } else {
      urlId = match.params._id;
    }
    // dann über location
    if (!urlId) {
      if (!location) {
        console.log("getUrlId: keine location-Variable! withRouter vorschalten.  match = ", match, ",   location = ", location, ",   history = ", history);
      } else {
        urlId = location.pathname.split("/").reverse().find(el => (el.length>10 && el.search(/\d/g)!==-1));
      }
    }
    // dann über history
    if (!urlId) {
      if (!history) {
        console.log("getUrlId: keine history-Variable! withRouter vorschalten.  match = ", match, ",   location = ", location, ",   history = ", history);
      } else {
        urlId = history.location.pathname.split("/").reverse().find(el => (el.length>10 && el.search(/\d/g)!==-1));
      }
    }
    if (!urlId) {
      // console.log("getUrlId: keine urlId gefunden!  urlId = ", urlId, "    match = ", match, ",   location = ", location);
    }
    return urlId;
  }

  rightClick = (wort, typ) => { // Wort als Überschrift vom angegebenen Typ, zugehörigen satz im state setzen und zur url weiterleiten
    // Satz-ID ermitteln
    if (typeof typ!=="string")  typ = typ.wort;
    console.log({wort, typ});
    const satze = this.props.userdata.satze;
    let satzArr;
    if (wort._id) { // Wort ist Objekt
      satzArr = satze.filter(satz => {
        return (satz.wort._id === wort._id) && (satz.typ.wort === typ)
      });
      if (satzArr.length===0) { // Wort und Typ nicht vorhanden => nur nach Wort suchen
        satzArr = satze.filter(satz => satz.wort._id === wort._id);
      }
    } else {        // Wort ist String
      satzArr = satze.filter(satz => {
        // console.log(satz.wort,  wort,  satz.typ.wort, typ);
        return (satz.wort.wort === wort) && (satz.typ.wort === typ)
      });
      if (satzArr.length===0) { // Wort und Typ nicht vorhanden => nur nach Wort suchen
        satzArr = satze.filter(satz => satz.wort.wort === wort);
      }
    }
    // Satz aus Array auswählen
    let satz;
    switch (satzArr.length) {
      case 0:
      alert(`Leider kein Satz mit der Überschrift "${wort.wort || wort}" gefunden!`);
      return null;
      case 1:
      satz = satzArr[0];
      break;
      default: // !!! was ist bei mehreren Treffern -> Auswahl erstellen
      satz = satzArr[Math.floor(Math.random()*satzArr.length)];  // Zufallselement aus dem Array auswählen,   Alternative: satz = satzArr[0];
    }
    console.log("satz", satz);
    this.props.userdata.set({satz});
    return satz;
  }

  leftClick = wort => { // angeklicktes Wort als wort im state setzen
    console.log({wort});
    console.log("this.props.userdata.worte", this.props.userdata.worte);
    if (!wort.wort) { // ggf wort in wort-Objekt umwandeln
      wort = (this.props.userdata.worte && this.props.userdata.worte[wort])?
      this.props.userdata.worte[wort]:
      worteVonSatze(this.userdata.satze)[wort];
    }
    // console.log("wort", wort.wort);
    this.props.userdata.set({wort});
  }

  render() {
     // Umleitung zur richtigen satzurl (.../satz._id)
    const {satz, satze, user} = this.props.userdata;
    const {history} = this.props;
    const sign = history.location.pathname.split("/").some(el=>[`signin`, `signup`].includes(el));
    // wenn Satze noch nicht geladen zu start wechseln
    if (!(satze && satze.length>0) && !sign) {
      console.log("loc", history.location.pathname);
      console.log("UserDat.js: Es wurden noch keine satze geladen!  satze = ", satze, "  username: ", user.username);
      if (user.username==="unbekannt") {
        console.log("UserDat.js: <Redirect to={`/signin/`} />");
        return <Redirect to={`/signin/`} />
      } 
      // else if (history.location.pathname!==`/start/`) {
      //   console.log("UserDat.js: <Redirect to={`/start/`} />");
      //   return <Redirect to={`/start/`} />
      // } 
    // wenn Satze geladen satz mit url abgleichen
    } else if (satze && satze.length>0) {
      const urlSatz = this.getUrlSatz();
      let satzurl;
      if (satz && (!urlSatz || satz._id!==urlSatz._id)) {
        satzurl = this.getSatzUrl(satz);
        if (satzurl && history.location.pathname!==satzurl) {
          console.log(`UserDat.js: <Redirect to=${satzurl} />`);
          // history.push(satzurl);   // ergibt Warning: "Cannot update during an existing state transition ..."
          return <Redirect to={satzurl} />  // <Redirect to={`/worte/surf/${satze[satzIx]._id}`} />
        }
      }
    }
    // richtige satzurl => Routes
    // console.log("UD userdata: ", this.props.userdata)
    const handleClick = { left: this.leftClick, right: this.rightClick };
    return <Routes {...this.props} 
      handleClick={handleClick} 
      loaddata={false} 
    />
  }
};

export default UserDat;
