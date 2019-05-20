import React from "react";
import { Mutation } from "react-apollo";
import { 
  UPDATE_FULL_SATZE, 
  GET_USER_SATZE, 
  SUCH_SATZE,
  GET_CURRENT_USER,
} from "../../queries";
import {buttonupdate} from "./buttonupdate";

class UpdateButton extends React.Component {

  handleUpdate = (event, updateFullSatze, saetze) => {
    event.preventDefault();
    const {userdata} = this.props;
    updateFullSatze({
      variables: {
        "input": {
          saetze
        }
      }
    }).then(({ data: {updateFullSatze} }) => {
      // console.log("saetze", saetze);
      console.log("updated", updateFullSatze);
      let unsaved = null;
      if (updateFullSatze.filter(s => !!s).length===0) {
        unsaved = saetze;
      // gespeicherte saetze ausfiltern -> unsafed
      } else {
        unsaved = saetze.filter(satz => !updateFullSatze.some(sa => 
          sa && sa.username===satz.username && sa.typ.wort===satz.typ && sa.wort.wort===satz.wort))
        if (unsaved.length===0) unsaved = null;
      }
      console.log({unsaved});
      userdata.set({satzeEdit: unsaved});
    }).catch(err =>{
      // console.log("saetze:",saetze);
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
    const {suchBegr="", user: {username}} = this.props.userdata;
    let {button=true, disabled, saetze} = this.props;
    saetze = !(saetze && saetze.length>0)? saetze:  // saetze = null oder alle keys vorhanden
    saetze.map(s => ({  // Daten für SatzFullInput extrahieren
      _id:s._id,
      typ:s.typ, 
      wort:s.wort, 
      worte:s.worte, 
      worteIf:s.worteIf, 
      username:s.username
    }));
    // console.log("saetze:",saetze);
    return (
      <Mutation
        mutation={UPDATE_FULL_SATZE}
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
        update={(cache, { data: { updateFullSatze } }) => {
          const updateSatze = updateFullSatze.filter(s => !!s);
          const deleteIds = saetze.filter(s => !!s).map(s => s._id);
          buttonupdate({
            cache, 
            updateSatze, 
            deleteIds, 
            suchBegr, 
            username, 
            GET_USER_SATZE, 
            SUCH_SATZE, 
            GET_CURRENT_USER
          });
        }}
      >
        {(updateFullSatze, attrs) => {
          let valid = !disabled && this.validateForm(saetze);
          return (
            button?
            (<div>
              <button
                // className="button-primary button-add"
                disabled={!valid}
                onClick={event => this.handleUpdate(event, updateFullSatze, saetze)}
                style={!valid? {fontWeight:600}: {color: "rgb(0,192,100)", fontWeight:600}}
                type="button"
              >
                {attrs.loading ? "ändert..." : String.fromCodePoint(8645)+" Ändern"}
              </button>
            </div>):
            (<div>
              <a
                onClick={event => this.handleUpdate(event, updateFullSatze, saetze)}
                style={{fontWeight:600}}
              >
                {attrs.loading ? "ändert..." : String.fromCodePoint(8645)}
              </a>
            </div>)
          );
        }}
      </Mutation>
    )
  }
}

export default UpdateButton;