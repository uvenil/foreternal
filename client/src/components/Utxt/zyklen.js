// Cooles, dynamisches Gesamtsystem mit nur einem Zustand (userdata), aber mehreren interagierenden Komponenten
// Schritte definieren sich über Zustandsvariablen (z.B. userdata.satzeEdit) und bestimmen die angezeigten Komponenten
// Komponente eines Zyklus bearbeiten gemeinsam eine oder mehrere globale Variablen (Bsp.: satzeEdit)
// Zustand: null/undefined => kein Zyklus, [], {} oder Wert => Zyklus (Ausnahme: viewedit)

import React from "react";
import SatzTable from "./../SatzTable/SatzTable";
import TextInput from "./../CRUD/TextInput";

// zix = Index im Array, bestimmt Komponente (entspricht zid),  zelle: Zelle im grid,  zyx (nicht benötigt) = [y, x]-Koordinaten der Zelle
// const cyclesEinfach = ({userdata: {satzeEdit, satzeSave}}) => ({
//   viewedit: satzeEdit? 0: 1,  // 1. Suche/Liste    View;  2. Bearbeitung    Edit + View
//   vieweditcheck: !satzeEdit? 0: !satzeSave? 1: 2  // 1. Suche/Liste    View;  2. Bearbeitung    Edit + View;   3. Entscheidung   Neu + ALt + Edit
// });

const zyklen = ({
  tableedit: ({handleClick, satze, userdata, userdata: {satzeEdit}}) => {   // 1. Suche/Liste    View;  2. Bearbeitung    Edit + View
    const step = !satzeEdit? 0: 1;
    return ({
      step,
      comps: [  // Komponenten, deren Sichtbarkeit, Ort (Zelle) und props abhängig vom zyklus-step sind
        { // View
          Component: SatzTable,
          zelle: "a00",
          visible: step===0,
          alternativ: <p>Hier wäre die Tabelle!</p>,
          props: {
            defaultSorted: [
              {id:"level", desc:false},
              {id:"updatedDate", desc:true},
              {id:"wort", desc:false},
              {id:"typ", desc:false},
            ],
            ersteZeile: false,
            foldcols: [...new Set(["Nr.", "worteIf", "username", "createdDate"])],
            folded: {col_0: false, col_1: false, col_2: false},
            handleClick,
            // pivot: ["wort"],
            satze,
            // strongs: ["neues"],
            userdata,
            wortinfo: false,
            zix: 0,
          },
        },
        { // Edit 
          Component: TextInput,
          zelle: "a00",
          visible: step===1,
          alternativ: <p>Hier erscheint Edit!</p>,
          props: {
            userdata,
            zix: 1,
          },
        },
      ],
    });
  },
  viewedit: ({handleClick, satze, userdata, userdata: {satzeEdit}}) => {   // 1. Suche/Liste    View;  2. Bearbeitung    Edit + View
    const step = !satzeEdit? 0: 1;
    return ({
      step,
      comps: [  // Komponenten, deren Sichtbarkeit, Ort (Zelle) und props abhängig vom zyklus-step sind
        { // View
          Component: SatzTable,
          zelle: step===0? "a00": "a10",
          visible: true,
          alternativ: <p>Hier wäre die Tabelle!</p>,
          props: {
            ersteZeile: true,
            handleClick,
            satze: satze,
            userdata,
            zix: 0,
          },
        },
        { // Edit 
          Component: TextInput,
          zelle: "a00",
          visible: step===1? true: false,
          alternativ: <p>Hier erscheint Edit!</p>,
          props: {
            userdata,
            zix: 1,
          },
        },
      ],
    });
  },
  vieweditcheck: ({userdata, userdata: {satzeEdit=null, satzeSave=null}}) => {  // 1. Suche/Liste    View;  2. Bearbeitung    Edit + View;   3. Entscheidung   Neu + ALt + Edit
    const step = !satzeEdit? 0: !satzeSave? 1: 2;
    return ({
      step,
      comps: [  // Komponenten, deren Sichtbarkeit, Ort (Zelle) und props abhängig vom zyklus-step sind
        { // Alt
          Component: SatzTable,
          zelle: console.log("vieweditcheck", {step}) || step===0? "a00": "a10",
          visible: true,
          alternativ: <p>Hier wäre die Suche!</p>,
          props: {
            satze: userdata.satze,
          },  // {suchBegr}, über userdata
        },
        { // Edit 
          Component: TextInput,
          zelle: step===1? "a00": step===2? "a20": "",
          visible: step===0? false: true, // [1, 2].includes(step)? true: false,
          alternativ: <p>Hier erscheint Edit!</p>,
          props: {
            userdata,
          },  // {formatName, satzeEdit, textInput}
        },
        { // Neu
          Component: SatzTable,
          zelle: "a00",
          visible: step===2? true: false,
          alternativ: <p>Hier erscheint Neu!</p>,
          props: {
            satze: userdata.satze,
            satzeEdit: userdata.satzeEdit,
            satzeSave: userdata.satzeSave,
          }, // {suchBegr, satzeEdit, satzeSave}, über userdata
        },
      ],
    });
  },
});

export default zyklen;