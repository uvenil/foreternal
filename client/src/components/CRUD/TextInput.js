import React from "react";
import { withRouter } from "react-router-dom";
import Textarea from 'react-textarea-autosize';

import { CellFold, Grid } from "./../CellFold";
import TrennEingabe from "./TrennEingabe";
import SatzEditCont from "./SatzEditCont";
import SatzEditListe from "./SatzEditListe";
import {formatSatze} from "../../util/formatSatze"

// Reihenfolge der Komponenten: 
// TextInput     -> SatzEditCont -> SatzEditListe -> SatzEditEintrag
// | TrennEingabe | SatzEditOpt | SatzZellListe  | SaveButton | DeleteButton

// erhält {formatName, satzeEdit, textInput} = userdata

/*
// Unterscheidung:
// --- satze zur Bearbeitung (Ladeformat wird hier umgewandelt in Bearbeitungsformat) ---
// (satzeEdit kann in beiden Formaten vorkommen): {
//   wort:ObjID, 
//   worte:[ObjID], 
//   typ:"typ", 
//   username, 
//   createdDate, 
//   worteIf:[ObjID]
// }
// --- saetze aus Textinput (Bearbeitungs- und Speicherformat) ---
// (saetzeInput): {
//   wort:"wort", 
//   worte:"wort wort", 
//   typ:"typ", 
//   username
//   createdDate, 
//   worteIf:"wort wort"
// }
// saetze-Format zur Eingabe in SatzEditCont.js, Ausgabe:satze:   textInput + satzeEdit -> satzeNew
*/

const inputFormats = {
  // Aufbau: (Subueb = gleichzeitig Wort des Überschriftssatzes)
  // Ueberschrift "uebtrenn" Subueb "subuebtrenn" Satz "satztrenn" Subueb "subuebtrenn" Satz "satztrenn" oder
  // Ueberschrift "uebtrenn" Satz "satztrenn" Satz "satztrenn"
  // Satz "satztrenn" Satz "satztrenn"
  // Trennzeichen vorhanden => Element vorhanden (z.B. uebtrenn => Überschrift)
  "Google Notizen": {
    satztrenn: "\\n",
    subuebtrenn: "",
    uebtrenn: "\\n\\n"
  },
  "Text": {
    satztrenn: ". ",
    subuebtrenn: "", // wenn "" => keine Sub-Überschrift
    uebtrenn: "\\n\\n" // wenn "" => keine Überschrift
  }, 
}
const initialState = {
  formatName: "Google Notizen",
  textInput: "",
  satzeEdit: null,    // satze zur Bearbeitung: {wort:ObjID, worte:[ObjID], typ:"typ", username, createdDate, worteIf:[ObjID]}
  saetzeInput: null,  // saetze aus Textinput: {wort:"wort", worte:"wort wort", typ:"typ", username}
  satztrenn: "",
  subuebtrenn: "",
  ueberschrift: "",
  uebtrenn: "",
}

class TextInput extends React.Component {
  constructor(props) {
    // console.log("props", props);
    super(props);
    this.state = { ...initialState }
  }

  clearState = () => {
    const formatState = this.inputFormatChange(initialState.formatName);
    this.setState({ ...initialState, ...formatState });
  }

  componentDidMount() { // userdata in state schreiben
    let { // initialState als default Werte
      formatName=initialState.formatName, 
      satzeEdit=initialState.satzeEdit, 
      textInput=initialState.textInput, 
      // user: {username}
    } = this.props.userdata;
    const formatState = this.inputFormatChange(formatName);
    this.setState({
      ...initialState,
      ...formatState,
      satzeEdit: formatSatze(satzeEdit),
      textInput,
      // username,
    });
  }

  componentWillUnmount() { // state in userdata setzen
    const {formatName, textInput} = this.state;
    this.props.userdata.set({formatName, textInput});
  }

  handleChange = event => {
    let { name, value } = event.target;
    if (name==="formatName") {
      const formatState = this.inputFormatChange(value);
      this.setState({ ...formatState })
    } else {
      this.setState({ [name]:value }, () => {
        // console.log("{ name, value }", { name, value })
      });
    }
  }

  handleSubmit = (event) => { // submit Textinput
    event.preventDefault();
    let { textInput } = this.state;
    console.log("textInput", textInput);
    console.log("this.state hs", this.state);
    const { satzText, ueberschrift } = this.uebTrenn(textInput);
    const saetzeStrings = this.satzTrenn(satzText);
    let saetzeInput = this.subuebTrenn(saetzeStrings);
    this.setState({ saetzeInput, ueberschrift });
    return;
  }

  inputFormatChange = formatName => {
    // console.log("formatName", formatName)
    const formatState = {
      formatName,
      satztrenn: inputFormats[formatName].satztrenn,
      subuebtrenn: inputFormats[formatName].subuebtrenn,
      uebtrenn: inputFormats[formatName].uebtrenn
    };
    return formatState;
  }

  parse = str => {  // nur Buchstaben, Zahlen und neue Zeile (\n)
    // console.log("str", str);
    const changestr = "ä0ä0ä0ä0ä";
    let re, exchanged, rechanged, parsed;
    exchanged = str;
    const zeichenArr = ["\\[", "\\.", ",", ";", ":", "–", "!", "\\?", "=", "«", '\\"', "'", 
    "\\/", "\\\\n", "\\]", "#", "\\+", "§", "&", "\\(", "\\)", "`"];
    const rechangeArr = ["\[", "\.", ",", ";", ":", "–", "!", "\?", "=", "«", '\"', "'", 
     "\/", "\\n", "\]", "#", "\+", "§", "&", "\(", "\)", "`"];
    zeichenArr.forEach((z, ix) => {
      re = new RegExp(z, 'g');
      exchanged = exchanged.replace(re, String(ix)+changestr+String(ix)+changestr+String(ix));
    })
    rechanged = exchanged.replace(/[^a-zäöüßA-ZÄÖÜ 0-9]/g, ""); // Satzzeichen entfernen  // normstr = normstr.replace(/[^a-zA-Z 0-9]/g, "");
    rechangeArr.forEach((z, ix) => {
      re = new RegExp(String(ix)+changestr+String(ix)+changestr+String(ix), 'g');
      rechanged = rechanged.replace(re, z);
    })
    parsed = JSON.parse('"'+ rechanged +'"');
    // console.log("parsed", parsed);
    return parsed;
  }

  satzTrenn = (satzText) => { // trennt text in einzelne saetze
    let { satztrenn } = this.state;
    satztrenn = this.parse(satztrenn);  // Eingabe entschärfen
    let saetzeStrings = satzText.split(satztrenn);
    saetzeStrings = saetzeStrings.filter(satz => satz.replace(" ", "")!=="");
    return saetzeStrings;
      // console.log("text", text);
      // this.props.history.push("/satze/add");
  }

  subuebTrenn = (saetzeStrings) => { // trennt text in einzelne saetze
    // console.log("saetzeStrings", saetzeStrings);
    let { subuebtrenn } = this.state;
    let saetzeInput;
    subuebtrenn = this.parse(subuebtrenn);    // Eingabe entschärfen
    if (!saetzeStrings.length || saetzeStrings.length===0) {
      console.log("Fkt. subuebTrenn: keine saetzeStrings!   saetzeStrings = ", saetzeStrings)
      return [];
    }
    if (!subuebtrenn) {
      saetzeInput = saetzeStrings.map(worte => ({worte}));
    } else {
      saetzeInput = saetzeStrings.map(worte => (
        console.log("worte", worte) ||
        worte.indexOf(subuebtrenn)===-1? {worte} : {
          wort: worte.split(subuebtrenn)[0],
          worte: worte.split(subuebtrenn).slice(1),
        }
      ));
    }
    // console.log("saetzeInput", saetzeInput);
    return saetzeInput;
  }

  uebTrenn = (textInput) => { // trennt die Hauptüberschrift vom restlichen Text
    let { uebtrenn } = this.state;
    uebtrenn = this.parse(uebtrenn);    // Eingabe entschärfen
    let ueberschrift, satzText;
    if (uebtrenn && textInput.indexOf(uebtrenn)!==-1) {
      let uebArr = textInput.split(uebtrenn);
      ueberschrift = uebArr[0];
      satzText = uebArr.slice(1).join(uebtrenn);  // satzText ohne Überschrift
    } else {
      ueberschrift = "";
      satzText = textInput;
    }
    return { satzText, ueberschrift }
  }

  validateForm = () => {
    const { textInput } = this.state;  // wort, 
    const isInvalid = !textInput; //!wort || 
    return isInvalid;
  }

  render() {
    const {
      formatName,   // wird durch  userdata  (reset: initialState) gesetzt
      satzeEdit,    // wird durch  userdata  (reset: initialState) gesetzt
      textInput,    // wird durch  userdata  (reset: initialState) gesetzt
      saetzeInput,  // wird durch  handleSubmit  gesetzt
      ueberschrift, // wird durch  handleSubmit  gesetzt
      satztrenn,    // wird durch  formatName  gesetzt
      subuebtrenn,  // wird durch  formatName  gesetzt
      uebtrenn,     // wird durch  formatName  gesetzt
    } = this.state;
    // let satzeEdit = this.props.satzeEdit || [];
    const typ = this.props.typ || "Satz"; // als props übergeben
    // const {zix} = this.props;
    // satzeEdit = formatSatze(satzeEdit);
    // console.log("satzeEdit", satzeEdit);
    // console.log("saetzeInput", saetzeInput);

    const {userdata} = this.props;
    console.log({userdata});
    // !!! hier: warum kommt danach sofort withSession bei Texteingabe ohne Login
    return (
      <Grid
        columns={"auto"}
        rows={"repeat(3, auto)"}
        gap="2px"
        areas={[
          "ein",
          "tab",
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
        <CellFold summary="Eingabe" area="ein" style={{ position: "relative" }}>
          <h2 className="near">Text eingeben oder einkopieren</h2>
          <form
            className="form"
          >
            <Textarea
              autoFocus={true}
              cols="100"
              name="textInput"
              onChange={this.handleChange}
              placeholder="Sätze bitte hier eingeben"
              rows={40}
              value={textInput}
              wrap="soft"
            >
            </Textarea>
            <div>
              <button 
                className="button-primary button-del"
                onClick={this.clearState}
                type="button" 
                value="Reset"
              >
                Zurücksetzen
              </button>
              <button
                className="button-primary button-add"
                disabled={this.validateForm()}
                onClick={event => this.handleSubmit(event)}
                type="button"
              >
                Bearbeitung ->
              </button>
            </div>
            {/* {error && <Error error={error} />} */}
          </form>
        </CellFold>
        <CellFold summary="Bearbeitung" area="tab" style={{ position: "relative" }}>
          <h2 className="near">Bearbeitung</h2>
          {
            // this.props.userdata.get("textInput")
          }
          <SatzEditCont 
            saetzeInput={saetzeInput}
            satzeEdit={satzeEdit}
            typ={typ}
            ueberschrift={ueberschrift}
            userdata={this.props.userdata}
          >
            <TrennEingabe 
              formatName={formatName}
              handleChange={this.handleChange} 
              inputFormats={inputFormats}
              satztrenn={satztrenn}
              subuebtrenn={subuebtrenn}
              uebtrenn={uebtrenn}
            />
          </SatzEditCont>
        </CellFold>
      </Grid>
    );
  }
}

export default withRouter(TextInput);
