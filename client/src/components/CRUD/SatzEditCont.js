import React from "react";

import SatzEditListe from "./SatzEditListe";
import SatzEditOpt from "./SatzEditOpt";
import SatzZellListe from "./../common/SatzZellListe";      // Überschriften + Satze
// import SatzVorschau from "./SatzVorschau";
// import SatzTable from "./../SatzTable/SatzTable";      // Überschriften + Satze
// import SatzTableEdit from "./../SatzTable/SatzTableEdit";      // Überschriften + Satze
import createCheckbox from './../common/createCheckbox';
import createSelect from './../common/createSelect';
import { einleer, normstr } from "../../util/wortber";
import { pick } from "../../util/formatSatze";
import withQuery from "./../HOC/withQuery";
import { 
  GET_SAVE_STATI,
} from "../../queries";

const initialState = {
  getSaveStati: null,
  anzSaetze: 0,
  maxWorte: 20,    // maximale Anzahl darzustellender Worte pro Satz
  optset: { // Optionen hier
    Bearbeitungseinstellungen: ["standard"],
    Gross: ["egal"],  // Array nötig, damit Zahl- und Text-Inputfelder möglich
    Grossschreibung: ["unverändert"],
    Inhalt: ["egal", ""],
    Laenge: ["egal", 0, 0],
    Position: ["egal", 0, 0],
    Reihenfolge: ["unverändert", ""],
    Zeichen: ["ohne Satzzeichen"],
    typ: ["Satz"],  // wird durch props.typ überschrieben
  },
  saetze: [], // Array mit anderen Satz-Objekten! {wort, worte, typ, username} als Strings
  satzeSave: {},  // {"addFullSatze": [satze], "deleteSatze": [satze]}
  satzlisteloaded: false,
  selected: new Set([]),
  timeout: null,
}

// satzinput
// {
//   "typ": "Negativtaggruppe",
//   "wort": "selbst",
//   "worte": "die erkenntnis um ihrer selbst willen das ist der letzte fallstrick den die moral legt damit verwickelt man sich noch einmal völlig in sie",
//   "worteIf": "",
//   "username": "m"
// },

class SatzEditCont extends React.Component {
  constructor(props) {
    // console.log("props", props);
    super(props);
    this.state = { ...initialState }
  }

  componentDidMount() {
    // saetze aus props mit Grund-Attributen ausstatten
    this._isMount = true;
    let { user } = this.props.userdata;
    const {satztypen} = user;
    let { anzSaetze, saetzeInput, satzeEdit, typ } = this.props;
    let saetze = saetzeInput;
    if (!(saetze && saetze.length>0) && anzSaetze>0) {
      saetze = new Array(anzSaetze);
    }
    satzeEdit = satzeEdit || [];
    saetze = saetze || [];
    const satzVorlage = {
      wort: "",
      worte: "",
      worteIf: "",
      typ,
      username: user.username,
    }
    saetze = saetze.map((satz) => ({...satzVorlage, ...satz}));
    saetze = [null, ...saetze]; // Original-Eingabe in this.saetze speichern,  erstes Element ist Platzhalter für Überschrift
    // if (!(saetze && saetze.length>0)) saetze = [];
    this.saetze = [...saetze, ...satzeEdit];
    // selected, Checkbox-Groups und Optionen erstellen
    this.optionen = SatzEditOpt(satztypen); // Optionen
    this.checkboxGroups = [{
      allId: "allesaetze",
      noneId: "",
      idSet: new Set([...Array(saetze.length).keys()].map(n => String(n)))
    },]
    let selected = new Set([ // ausgewählte Checkboxen hier
      "allesaetze", 
      "Einstellungen anwenden",
      "ohne Stoppworte", 
      "Überschriftssatz",
      "Vorschau anzeigen",
    ]);
    if (!selected.has("Überschriftssatz"))  this.checkboxGroups[0].idSet.delete("0");
    selected = this.setCheckboxGroup(selected);
    selected.delete("0");
    // Optionen (optset und selected) im state setzen
    if (!this._isMount)   return;
    this.setState(({optset}) => ({
      optset: {...optset, typ:[typ]},
      selected,
    }), () => { // saetze im state setzen
      // console.log("saetze1", saetze)
      // Worte und Überschrift gemäß Optionen bearbeiten
      saetze = this.changeWorte(true, saetze);  
      saetze = saetze.map((satz, ix) => {  // wort (Subüberschrift) nur zu Beginn für die satze austauschen, für die sie im Input übergeben wurde
        if (this.saetze[ix] && !!this.saetze[ix].wort)   return {...satz, wort:this.saetze[ix].wort}
        return satz;
      })
      saetze = [...saetze, ...satzeEdit]; // saezeInput + satzeEdit (Bearbeitung wurde zu Beginn nicht auf satzeEdit angewendet)
      this.checkboxGroups[0].idSet = new Set([...Array(saetze.length).keys()].map(n => String(n)));
      if (!selected.has("Überschriftssatz"))  this.checkboxGroups[0].idSet.delete("0");
      selected = this.setCheckboxGroup(selected);
      selected.delete("0");
      this.setState({ 
        saetze, 
        selected 
      }, () => { // saetze im state setzen
        if (saetze.length>1) {  // Index 0 ist potentielle Überschrift
          saetze = this.changeUeberschrift(saetze);
        }
        // console.log("this.saetze", this.saetze)
        this.setState({ 
          saetze, 
          satzlisteloaded: true, // loaded = Zeichen, dass man sich auf den state verlassen kann
        })
      })
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // hilft vielleicht gegen memory leak
    if (prevState.timeout !== this.state.timeout) {
      clearTimeout(prevState.timeout);

      // const timeout = setTimeout(() => this.setState({ getSaveStati:null, timeout:null }), 5000); // state.timeout als Zeichen, dass eine Änderung stattgefunden hat
      // this.setState(prevState => {
      //   // console.log("clear: ", prevState.timeout);
      //   clearTimeout(prevState.timeout);
      //   return {...newState, timeout};
      // });
  
    }
  }

  componentWillUnmount() {
    this._isMount = false;
    // const {satzeSave} = this.state;
    // console.log("this.timeoutID", this.timeoutID)
    clearTimeout(this.state.timeout);
    // this.props.userdata.set({satzeSave});
  }

  changeWert = (name, value, saetze = this.state.saetze) => {  // den gleichen Wert für alle Saetze setzen
    const {selected} = this.state;  // eevtl. besser als Parameter übergeben?
    if (!(selected.has("Einstellungen anwenden")))  return saetze;
    value = JSON.parse('"'+value+'"');
    if (selected) { // Set selected übergeben, auch leeres Set
    // saetze durchlaufen und wert aktualisieren
      saetze = saetze.map((satz, ix) => {
        if (!(selected.has(String(ix)))  || satz==null)  return satz;  // satz nicht selektiert
        return {...satz, [name]:value}  // wert aktualisieren
      });
    } else {  // selected wurde nicht als Parameter übergeben
      saetze = saetze.map(satz => ({...satz, [name]:value}));
    }
    return saetze;
  }
  
  changeWorte = (bWorte=true, saetze=this.state.saetze) => { // true = worte + wort, false = wort (nur)
    const {optset, selected} = this.state;  // evtl. besser als Parameter übergeben?
    if (!(selected.has("Einstellungen anwenden")))  return saetze;
    const {optionen} = this;
    // Reihenfolge je stringenter/spezifischer, desto früher -> Motiv: möglichst ein Ergebnis erhalten
    let reihenfolge = bWorte ? [  // bei Checkbox die Option als value nehmen
      "Eingabe",
      "Kleinbuchstaben", 
      "Wortanfang groß",
      "Großbuchstaben",
      "Leerzeichen einfach",
      "ohne Satzzeichen",
      "mit Satzzeichen",
      "alphabetisch",
      "bevorzugt",
      "umgekehrt",
      "unverändert",
    ] : [
      "groß geschrieben",
      "klein geschrieben",
      "enthält",
      "ohne",
      "genau",
      "x-kürzestes",
      "x-längstes",
      "zwischen L",
      "x-tes",
      "zwischen P",
      "ohne Stoppworte",
      "egal",
    ];
    reihenfolge = reihenfolge.reverse(); // nicht aufgeführte (Index -1) werden nach hinten sortiert, daher reverse
    // zu verarbeitende Optionen zusammenstellen und nach der Reihenfolge der Werte sortieren
    let opts = bWorte ? [...optionen.worteOpt] : [...optionen.wortOpt]; // Optionen, die wort(e) verändern können
    opts = opts
      .filter(opt => (!optionen.checkBox.has(opt) || selected.has(opt))) // keine Checkbox oder selektierte Checkbox -> unselektierte Checkboxen entfernen
      .sort((opta, optb) => {
        let valuea = optionen.checkBox.has(opta) ? opta : optset[opta][0];
        let valueb = optionen.checkBox.has(optb) ? optb : optset[optb][0];
        return (reihenfolge.indexOf(valueb) - reihenfolge.indexOf(valuea));
      });
    // saetze durchlaufen und wort(e) aktualisieren
    saetze = saetze.map((satz, ix) => {
      if (!(selected.has(String(ix))) || satz==null)  return satz;  // satz nicht selektiert
      let {worte} = satz;
      if (!bWorte)  worte = einleer(worte).split(" "); // Array worte
      // Optionen für aktuellen Satz durchlaufen
      opts.forEach(opt => { // worte filtern
        // console.log("--- opt", opt);
        if (!bWorte && (!worte || !worte[0])) return;  // keine wor Veränderung der Überschrift (wort)
        if (optionen.checkBox.has(opt)) {
          const aktFkt = optionen[opt]; // Aktualisierungsfunktion für Checkbox
          const stopworte = this.props.userdata.user.stopworte.map(wo => wo.wort);
          worte = aktFkt(worte, stopworte);
        } else {
          const aktFkt = optionen[opt][optset[opt][0]]; // Aktualisierungsfunktion für Option
          worte = aktFkt(worte, optset[opt][1], optset[opt][2], this.saetze[ix].worte);
        }
        // console.log("worte", worte)
      })
      // Worte aktualisieren
      if (bWorte) {
        return {...satz, worte}  // worte aktualisieren
      // Wort aktualisieren
      } else {
        let {wort} = satz;
        if (!worte)   console.log("!worte");
        if (!worte || worte.length===0)   wort = "";
        else if (worte.length===1)   wort = worte[0];
        else wort = worte[0];
        return {...satz, wort}  // worte aktualisieren
      }
    });
    if (bWorte) saetze = this.changeWorte(false, saetze); // nach Änderunge der Worte immer auch die Wort-Funktion aufrufen
    return saetze;
  }

  changeUeberschrift = (saetze=this.state.saetze) => {  // Ueberschriftssatz setzten und entfernen
    let {selected, optset} = this.state;
    if (!selected.has("Einstellungen anwenden") || saetze.length===0 || !saetze[1]) return;
    // Uesatz hinzufügen oder löschen
    let uesatz = !selected.has("Überschriftssatz")? null: {
      wort: !this.props.ueberschrift.trim()? "": this.changeWorte(true, [{worte:this.props.ueberschrift}])[0].wort,  // übergebene Überschrift als Worte, verarbeitet, dann das 1. wort
      worte: saetze.filter(s => !!s).map(satz => satz.wort).join(" "),
      worteIf: "",
      typ: optset.typ[0],
      username: this.props.userdata.user.username,
    };
    saetze[0] = uesatz;
    this.saetze[0] = uesatz;
    // checkboxGroup anpassen
    this.checkboxGroups[0].idSet = new Set([...Array(saetze.length).keys()].map(n => String(n)));
    if (!selected.has("Überschriftssatz"))  this.checkboxGroups[0].idSet.delete("0");
    return saetze;
  }

  handleOptChange = event => {
    if (!event) return this.state.optset;  // bei Aufruf ohne event werden die aktuell eingestellten Optionen zurückgeben
    let { name, value } = event.target;
    value = JSON.parse('"'+value+'"');  // ausgewählter Optionswert, z.B. "ohne Satzzeichen", "6"(Laenge)
    const {optionen} = this;
    const opt = String(name.split(optionen.trenn)[0]); // angewählte Option (z.B. Satzzeichen)
    const ix = Number(name.split(optionen.trenn)[1]);  // zu verändernder Index
    const bWorte = optionen.wortOpt.has(opt) ? false : true;
    // console.log("++++++++++++", opt, ": ", value);
    // Optionen (optset und selected) im state setzen
    this.setState(({optset}) => { 
      if (opt==="Bearbeitungseinstellungen") {
        const einst = this.optionen[opt][value];
        let selected = einst.selected;
        optset = einst.optset;  // this.state.optset[opt][0] = neuer Optionswert (z.B. standard)
        selected = this.setCheckboxGroup(selected);
        return ({optset, selected});
      } else {
        let optArr = [...optset[opt]];
        optArr[ix] = value; // gewünschtes Array-ELement wird verändert
        optset = {...optset, [opt]: optArr};
        return {optset};  // neues optset mit neuem Wert für opt
      }
    }, // saetze im state setzen
      () => ( 
        opt==="typ"? 
          this.timeoutset({saetze:this.changeWert(opt, value)}):
          this.setState({saetze:this.changeWorte(bWorte)})
      )
    );
  }

  handleZelleChange = (event, ix) => {
    const { name, value } = event.target;
    let {saetze} = this.state;
    saetze[ix][name] = value;
    this.timeoutset({saetze});
    // const timeout = setTimeout(() => this.setState({ getSaveStati:null, timeout:null }), 5000); // state.timeout als Zeichen, dass eine Änderung stattgefunden hat
    // this.setState(prevState => {
    //   // console.log("clear: ", prevState.timeout);
    //   clearTimeout(prevState.timeout);
    //   return {saetze, timeout};
    // });
  }

  timeoutset = (newState) => { // setzt newState im state mit timeout für saveStatus 
    const timeout = setTimeout(() => this.setState({ getSaveStati:null, timeout:null }), 5000); // state.timeout als Zeichen, dass eine Änderung stattgefunden hat
    this.setState(prevState => {
      // console.log("clear: ", prevState.timeout);
      clearTimeout(prevState.timeout);
      return {...newState, timeout};
    });
  }

  satzStat = (selected = this.state.selected, satze = this.userdata? this.userdata.satze: satze, saetze = this.state.saetze) => {
    // liefert statistische Daten zu EIngabesaetzen (satzFund, gleicheUeb, gleicheTypen)
    let satzFund, gleicheUeb, gleicheTypen;
    const nullReturn = {
      id: null,
      satzFund: null,
      gleicheUeb: null,
      gleicheTypen: null,
    };
    if (!(selected && selected.size>0 && satze && satze.length>0)) {
      return [nullReturn];
    }
    let satzStat = [...selected].map(id => {
      if (!saetze[id]) {
        return {...nullReturn, id};
      } 
      satzFund = satze.filter(s => s.wort.wort===saetze[id].wort);
      gleicheUeb = satzFund.map(s => s.typ); // Array mit den Typen der satze mit gleichen Überschriften
      gleicheTypen = satze.filter(s => s.typ===saetze[id].typ).map(s => s.wort.wort);
      satzFund = satzFund
        .filter(s => s.typ===saetze[id].typ);
      if (satzFund && satzFund.length>0) {
        satzFund = satzFund[0];
      } else {
        satzFund = null;
      }
      return ( {
        id,
        satzFund,
        gleicheUeb,
        gleicheTypen,
      });
    })
    return satzStat;
  }
  
  selectedSatze = (selected = this.state.selected, satze = this.userdata? this.userdata.satze: satze, saetze = this.state.saetze) => {
    // console.log({selected, satze, saetze});
    selected = new Set([...selected].filter(id => Number(id)>=0));
    if (!(selected && selected.size>0)) return [];
    let satzstat = this.satzStat(selected, satze, saetze);
    let selectedSatze = satzstat.map(ss => ss.satzFund).filter(satz => // console.log({satz}) ||
      satz!==null && satz!==undefined); // nur selektierte
    // const ids = [...selected].filter(id => Number(id)>=0).map(id => saetze[id]);
    if (!selectedSatze.length>0) {
      // console.log("Fkt. selectedSatze: Es wurden keine Satze gefunden!");
      selectedSatze = null;
    }
    return selectedSatze;
  };

  toggleCheckbox = id => {
    let {selected} = this.state;
    if (!id)  return selected;  // ohne Parameter "id" wird das Set mit den ausgewählten Checkboxen zurückegegeben
    id = String(id);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    this.checkboxGroups.forEach(group => selected = this.toggleCheckboxGroup(group, selected, id))
    this.setState(
      {selected}, 
      this.changeCheck(id) // Auswirkungen der Checkboxen auf den state
    );
  }

  changeCheck = (id) => { // Checkbox-Zustand auf den state anwenden
    let {selected} = this.state;
    let {optionen} = this;
    if (!selected.has("Einstellungen anwenden")) return;
    // id bestimmt Aktion
    if (optionen.wortOpt.has(id)) {
      this.setState({ saetze:this.changeWorte(false) });
    } 
    else if (optionen.worteOpt.has(id)) {
      this.setState({ saetze:this.changeWorte() });
    } 
    else if (id==="Einstellungen anwenden" || Number(id)>=0) {  // alle Einstellungen (worte, wort, typ) anwenden
      let saetze = this.changeWert("typ", this.state.optset.typ);
      this.setState({ saetze:this.changeWorte(true, saetze) });
    } 
    else if (id==="Überschriftssatz") {
      this.setState({ saetze:this.changeUeberschrift() });
    } 
  }

  toggleCheckboxGroup = ({idSet, allId, noneId}, selected, id) => { 
    // console.log("toggleCheckboxGroup", {group:{idSet, allId, noneId}, selected, id});
    // alle (allId) -> einzelne (idSet)
    if (id===allId) {
      if (selected.has(allId)) {  // allId gecheckt
        noneId && selected.delete(noneId);
        selected = new Set(
          [...selected, ...idSet]
        );
      } else {                    // allId ungecheckt
        noneId && selected.add(noneId);
        idSet.forEach(ix => selected.delete(ix));
      }
    // keine (noneId) -> einzelne (idSet)
    } else if (id===noneId) {
      if (!(selected.has(noneId))) {  // noneId ungecheckt
        allId && selected.add(allId);
        selected = new Set(
          [...selected, ...idSet]
        );
      } else {                      // noneId gecheckt
        allId && selected.delete(allId);
        idSet.forEach(ix => selected.delete(ix));
      }
    // einzelne (idSet) -> alle (allId)
    } else if (idSet.has(id)) {
      const checked = [...idSet].filter(ix => selected.has(ix));
      if (checked.length===idSet.size) {  // gesamte Gruppe gecheckt
        allId && selected.add(allId);
        noneId && selected.delete(noneId);
      }
      else if (checked.length===0) {      // Gruppe komplett ungecheckt
        allId && selected.delete(allId);
        noneId && selected.add(noneId);
      } else {                            // einzelne der Gruppe gecheckt
        allId && selected.delete(allId);
        noneId && selected.delete(noneId);
      }
    }
    return selected;
  }

  setCheckboxGroup = selected => {
    let id;
    this.checkboxGroups.forEach(group => {  // nur allId und noneId
      if (selected.has(group.allId)) id = group.allId;
      else if (selected.has(group.noneId)) id = group.noneId;
      else return;
      selected = this.toggleCheckboxGroup(group, selected, id);
    })
    return selected;
  }

  setstate = obj => {
    this.setState(prevState => ({...prevState, ...obj}));
  }


  render() {
    if (!this.state.satzlisteloaded) return null;
    const {
      handleOptChange, 
      handleZelleChange, 
      optionen, 
      toggleCheckbox
    } = this;
    const {children, userdata, zid} = this.props;
    const {satztypen} = userdata.user;
    const {getSaveStati, saetze, selected, timeout} = this.state;
    let selectedIds = this.selectedSatze(selected, userdata.satze, saetze); // Mongo-Ids der ausgewählten Saetze, sofern vorhanden
    // console.log({selectedIds});
    selectedIds = selectedIds? selectedIds.map(s => s._id): null;
    const saetzeArg = pick(saetze, ["_id", "typ", "wort", "worte", "worteIf", "username"]);
    let SatzEditListeQ;
    // console.log("this.timeoutID", this.timeoutID)
    if (getSaveStati) {
      // console.log("getSaveStati:", true);
      SatzEditListeQ = SatzEditListe;
    } else {
      // console.log("getSaveStati:", false);
      SatzEditListeQ = withQuery(GET_SAVE_STATI, { input: {saetze: saetzeArg} })(SatzEditListe);
    }
    
    return (  // Funktionen createCheckbox und createSelect werden dynamisch erstellt
      <div>  
        <SatzEditListeQ
          children={children}
          createCheckbox={createCheckbox(toggleCheckbox)}
          createSelect={createSelect(optionen, handleOptChange)}
          getSaveStati={getSaveStati}
          handleZelleChange={handleZelleChange}
          saetze={saetze}
          satztypen={satztypen}
          selected={selected}
          selectedIds={selectedIds} // benötigt ggf. zum Löschen der Sätze
          setstate={this.setstate}
          timeout={timeout}
          userdata={userdata}
          zid={zid}
        />
        {
          // !selected.has("Vorschau anzeigen")? null:
          // <div style={{float:"left"}}>
          //   <h2 className="near">Vorschau</h2>
          //   <SatzZellListe 
          //     satzListe={!saetze? []: saetze.filter(s => !!s).map(s => ({...s, worte:einleer(s.worte).split(" ")}) )}
          //     ersteZeile={selected.has("Überschriftssatz")}
          //   />
          //   {/* <SatzTable  */}
          //   {/* <SatzTableEdit
          //     saetze={!saetze? []: saetze }
          //   /> */}
          // </div>
        }
      </div>

    );
  }
}

export default SatzEditCont;
