import React from "react";
import { Mutation } from "react-apollo";
import { 
  ADD_FULL_SATZE, 
  GET_USER_SATZE, 
  SUCH_SATZE,
  GET_CURRENT_USER,
} from "../../queries";
import {buttonupdate} from "./buttonupdate";

class SaveButton extends React.Component {

  handleSave = (event, addFullSatze, saetze) => {
    event.preventDefault();
    const {userdata} = this.props;
    addFullSatze({
      variables: {
        "input": {
          saetze
        }
      }
    }).then(({ data: {addFullSatze} }) => {
      // console.log("saetze", saetze);
      console.log("saved", addFullSatze);
      let unsaved = null;
      if (addFullSatze.filter(s => !!s).length===0) {
        unsaved = saetze;
      // gespeicherte saetze ausfiltern -> unsafed
      } else {
        unsaved = saetze.filter(satz => !addFullSatze.some(sa => 
          sa && sa.username===satz.username && sa.typ.wort===satz.typ && sa.wort.wort===satz.wort))
        if (unsaved.length===0) unsaved = null;
      }
      console.log({unsaved});
      userdata.set({satzeEdit: unsaved});
    }).catch(err =>{
      console.log("Fehler:",err);
    });
  }

  validateForm = (saetze) => {
    let saetzeUnsave = saetze.filter((satz) => !(satz.wort && satz.worte && satz.typ)); // valide satze brauchen Überschrift, Worte und Typ
    if (saetzeUnsave && saetzeUnsave.length>0) {
      let message = `Folgende Sätze können nicht gespeichert werden:\n`;
      message += "Überschrift: Worte : Satztyp\n- "; 
      message += saetzeUnsave.map(satz => console.log({satz}, satz.typ.wort) || ((satz.wort||"Überschrift fehlt!") +": "+ (satz.worte||"Worte fehlen!") +" : "+ (satz.typ||"Satztyp fehlt!"))).join("\n- ");
      console.log(message);
    }
    return saetze && saetze.length>0 && saetzeUnsave.length===0;
  }

  render() {
    const {suchBegr, user: {username}} = this.props.userdata;
    let {button=true, saetze, disabled} = this.props;
    saetze = !(saetze && saetze.length>0)? saetze:  // saetze = null oder alle keys vorhanden
      saetze.map(s => ({  // Daten für SatzFullInput extrahieren
        typ:s.typ, 
        wort:s.wort, 
        worte:s.worte, 
        worteIf:s.worteIf, 
        username:s.username
      }));
    return (
      <Mutation
        mutation={ADD_FULL_SATZE}
        variables={{
          "input": {
            saetze
          }
        }}
        refetchQueries={() => [
          { query: GET_USER_SATZE, variables: { username }  },
          { query: SUCH_SATZE, variables: { suchBegr, username } },
          { query: GET_CURRENT_USER },
        ]}
        update={(cache,  { data: { addFullSatze } }) => {
          const updateSatze = addFullSatze.filter(s => !!s);
          buttonupdate({
            cache, 
            updateSatze, 
            deleteIds: [], 
            suchBegr, 
            username, 
            GET_USER_SATZE, 
            SUCH_SATZE, 
            GET_CURRENT_USER
          });
        }}
      >
        {(addFullSatze, attrs) => {
          let valid = !disabled && this.validateForm(saetze);
          return (
            button?
            (<div>
              <button
                // className="button-primary button-add"
                disabled={!valid}
                onClick={event => this.handleSave(event, addFullSatze, saetze)}
                style={!valid? {fontWeight:600}: {color: "green", fontWeight:600}}
                type="button"
              >
                {attrs.loading ? "speichert..." : String.fromCodePoint(10004)+" Speichern"}
              </button>
            </div>):
            (<div>
              <a
                onClick={event => this.handleSave(event, addFullSatze, saetze)}
                style={{fontWeight:600}}
              >
                {attrs.loading ? "speichert..." : String.fromCodePoint(10004)}
              </a>
            </div>)
          );
        }}
      </Mutation>
    )
  }
}

export default SaveButton;