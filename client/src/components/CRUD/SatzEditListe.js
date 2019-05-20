import React from "react";
import SatzEditEintrag from "./SatzEditEintrag";
import DeleteButton from "./../common/DeleteButton";
import SaveButton from "./../common/SaveButton";
import UpdateButton from "./../common/UpdateButton";

const SatzEditListe = ({ 
  children,
  createCheckbox,
  createSelect,
  data,
  getSaveStati,
  saetze, 
  satztypen, 
  selected,
  selectedIds,
  setstate,
  timeout,
  userdata,
  zid,
  ...props
}) => {
  if (data) {
    setstate({getSaveStati: data.getSaveStati});
  }
  if (!getSaveStati) return null;
  return (
  (!(saetze)) ? <p>Keine Sätze vorhanden</p> : (
    <form 
      className="App form table-wrapper"
      style={{alignItems:"flex-start", flexDirection:"column"}}
      // onSubmit={event => this.handleVorschau(event)}
    >
      <table style={{width:"100%"}}>
        <colgroup>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee'}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
          <col style={{backgroundColor: '#eee', width:"400px"}}></col>
          <col style={{backgroundColor: '#ddd'}}></col>
        </colgroup>
        <thead>
          {/* Speicherung, children */}
          {!children ? null : (
          <tr style={{verticalAlign:"top"}}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{verticalAlign:"top"}}>
              <div>
                {!userdata.set? null:
                <button
                  onClick={() => !!userdata.set? userdata.set({satzeEdit: null}): null}
                  type="button"
                >
                  Zurück
                </button>}
                <button
                  disabled={!timeout}
                  onClick={() => setstate({getSaveStati: null, timeout:null})}
                  type="button"
                  style={!timeout? {backgroundColor:"green", color:"grey"}: {backgroundColor:"red", fontWeight:600}}
                >
                  saveStatus
                </button>
              </div>
              <strong><i>Auswahl:</i></strong>
              <SaveButton
                // onClick={() => setstate({getSaveStati: null})}
                // saetze={ console.log("filt", getSaveStati.filter((ss, ix) => selected.has(String(ix)))) || // console.log({saetze}) ||
                //   saetze.filter((satz, ix) => !!satz && selected.has(String(ix)))}
                disabled={timeout}
                saetze={saetze.filter((satz, ix) => (
                  !!satz && selected.has(String(ix)) && getSaveStati[ix] && getSaveStati[ix].ops.includes("create")))}
                userdata={userdata}
              />
              <UpdateButton
                disabled={timeout}
                saetze={saetze.filter((satz, ix) => (
                  !!satz && selected.has(String(ix)) && getSaveStati[ix] && getSaveStati[ix].ops.includes("update")))}
                userdata={userdata}
              />
              <DeleteButton
                // ids={console.log({selectedIds}) || selectedIds}
                disabled={timeout}
                ids={//!data? selectedIds: 
                  getSaveStati
                    .filter((ss, ix) => selected.has(String(ix)))
                    .filter(ss => ss && ss.ops && ss.ops.includes("delete"))
                    .map(ss => ss.satz._id)}
                userdata={userdata}
              />
            </td>
            <td>{children}</td>
            <td></td>
          </tr>
          )}
          {/* Selektionen wort, worte, typ */}
          <tr style={{verticalAlign:"top"}}>
            <td>
            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
              <strong><i>
              {
                ["Einstellungen anwenden"]
                  .map(opt => createCheckbox(opt, "wortOpt", "Edit"))
              }
              </i></strong>
            </td>
            <td>
              {
                ["Überschriftssatz", "ohne Stoppworte"]
                  .map(opt => createCheckbox(opt, "wortOpt", opt))
              }
              {
                ["Gross", "Inhalt", "Laenge", "Position"]
                  .map(opt => createSelect(opt))
              }
            </td>
            <td>
              {
                ["Bearbeitungseinstellungen"]
                  .map(opt => createSelect(opt))
              }
              {
                ["Vorschau anzeigen"]
                  .map(opt => createCheckbox(opt, "wortOpt", opt))
              }
              {
                ["Grossschreibung", "Zeichen", "Reihenfolge"]
                  .map(opt => createSelect(opt))
              }
              {
                ["umgekehrt"]
                  .map(opt => createCheckbox(opt, "wortOpt", opt))
              }
            </td>
            <td style={{verticalAlign:"bottom"}}>
              {
                createSelect("typ")
              }
            </td>
          </tr>
          {/* Tabellenkopf, -beschriftung */}
          <tr style={{borderBottom:"2px solid black", borderTop:"2px solid black"}}>
            <th>
              {createCheckbox("allesaetze", "saetze")}
            </th>
            <th>Ops</th>
            <th>Savestatus</th>
            <th>Nr.</th>
            <th>Überschrift</th>
            <th>Satz</th>
            <th>Typ</th>
          </tr>
        </thead>
        <tbody>
          { // Saetze
            saetze.map((satz, ix) => (
              !satz? null:
              <SatzEditEintrag {...props} 
                createCheckbox={createCheckbox}
                key={ix}
                ix={ix}
                nr={ix===0? "Ü" :ix}
                fontWeight={((selected.has("Überschriftssatz")) && ix===0) ? "bold" : "normal"} 
                satz={satz} 
                satztypen={satztypen}
                savestatus={getSaveStati[ix]}
              />
            ))
          }
        </tbody>
      </table>
    </form>
  )
);
}

// const SatzEditListeQ = withQuery(GET_SAVE_STATI, { input: saetze })(SatzEditListe);
// export default withQuery(GET_SAVE_STATI, { input: saetze })(SatzEditListe);
export default SatzEditListe;
