import React from "react";
import {withRouter} from "react-router-dom";

// import withSatztypen from "./HOC/withSatztypen";  // wird noch nicht verwendet
import withUserSatze from "./HOC/withUserSatze";
import withCoreUrl from "./HOC/withCoreUrl";
import UserData from "./UserData";
import Routes from "./Routes";

let UserDataWith = withUserSatze(withCoreUrl(UserData));  // // alle satze, auf die der user Lese-Zugriff (eigene + freigegebene),  // wiederholt sich später in SatzGitter.js

const initialState = {
  userdata: null,
  withData: false,
  apploaded: false,
};

const initUserdata = {  // satze kommt von withUserSatze, user von withSession in index.js
  wort: null,   // {_id: , wort: , satz: , satze: }
  worte: null,  // {wort: _id, ...}
  satz: null,   // entspricht satzNested  {typ: , wort: {wort:, satz: , satze: }, worte: [{wort:, satz: , satze: }, ...]}
  satze: null,  // wird durch with withUserSatze gesetzt [{typ: , wort: , worte: }, ...]
  satzeView: null,  // Bearbeitungsformat oder Ladeformat,  angezeigte Satze, Vorauswahl
  satzeEdit: null,  // Bearbeitungsformat oder Ladeformat,  satze, die gerade editiert werden/wurden
  satzeSave: null,  // Ladeformat,                          satze, die gerade gespeichert wurden, müssen noch bestätigt werden
  suchBegr: "",
  formatName: "Google Notizen",
  textInput: "",
  // user:  kommt aus withSession
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  componentDidMount() { // satze aus GET_USER_SATZE im state setzen
    this.initUserdata();
  }

  // componentWillReceiveProps() { // satze aus GET_USER_SATZE im state setzen
  //   this.initUserdata();
  // }

  initUserdata() { // satze aus GET_USER_SATZE im state setzen
    if (!this.props.userdata.set) {
      const newuserdata = { // user kommt unter render aus this.props.userdata (withSession in index.js)
        // that: this,
        ...initUserdata,
        get: keyStr => {
          return this.state.userdata[keyStr];
        },
        set: this.userdataset,
      };
      newuserdata.set(newuserdata);
    }
  }

  userdataset = newDataObj => {
    // Test auf Identiät
    let equal = true;
    if (!this.state.userdata) {
      console.log("! userdata.set: userdata noch nicht vorhanden!   userdata", this.state.userdata);
      this.setState({
        userdata: {...newDataObj},
        apploaded: false,
      }, () => {
        // localStorage.setItem(`${user.username}_satze`, JSON.stringify(satze));  // Aktuelle Satzuswahl uunter aktuellen user speichern
        console.log("--- userdata.set init ---: ", newDataObj)
        this.setState({ apploaded: true });  // apploaded = Zeichen, dass man sich auf den state verlassen kann
      });
      return;
    }
    for (let key in newDataObj) {
      // if (!this.state.userdata || !this.state.userdata[key] || JSON.stringify(newDataObj[key])!==JSON.stringify(this.state.userdata[key])) {
      if (JSON.stringify(newDataObj[key])!==JSON.stringify(this.state.userdata[key])) {
        // console.log("key", key);
        console.log({[key]: this.state.userdata[key]}, " :userdata  newData: ", {[key]: newDataObj[key]})
        equal = false;
        break;
      }
    }
    if (equal) {
      console.log("! userdata.set bereits gesetzt: ", newDataObj)
      return true;  // keine Änderung nötig
    }  
    // state setzen
    this.setState(prevState => ({
      userdata: {...prevState.userdata, ...newDataObj},
      apploaded: false,
    }), () => {
      // localStorage.setItem(`${user.username}_satze`, JSON.stringify(satze));  // Aktuelle Satzuswahl uunter aktuellen user speichern
      console.log("--- userdata.set ---: ", newDataObj)
      this.setState({ apploaded: true });  // apploaded = Zeichen, dass man sich auf den state verlassen kann
    });
    return;
  }

  loaddata = () => {
    return this.setState({
      withData: true
    });
  }

  unloaddata = () => {
    this.setState({
      withData: true
    });
  }

  render() {
    if (!this.state.apploaded)  return null;  // Query noch nicht geladen
    const userdata = {...this.props.userdata, ...this.state.userdata};
    const props = {...this.props, userdata};  // : {...this.props.userdata, userdata}
    console.log(this.state.withData, "withData props", props);
    if (this.state.withData) {
      return <UserDataWith {...props} unloaddata={this.unloaddata}/>; // prop satze wird über withSatze gesetzt
    } else {
      return <Routes {...props} loaddata={this.loaddata}/>;  // ohne prop satze
    }
  }
};

export default withRouter(App);
// withSession vor withUserSatz (da User benötigt)
// ! wichtig: withHOC in dieser Reihenfolge, da sonst withSatze die data von withSession überschreibt
