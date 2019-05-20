import React from 'react';
import Textarea from 'react-textarea-autosize';
import {sortedobj} from "../../util/wortber";

const SatzEditEintrag = ({ 
  createCheckbox,
  fontWeight="normal",
  handleZelleChange, 
  ix,
  nr,
  satz: {wort, worte, typ}, 
  satztypen,
  savestatus,
  submitted = null
}) => (
//   { !satz ? <div>Keine Sätze vorhanden!</div> : ( 
  <tr style={{ fontWeight }}>
    <td>
      {createCheckbox(ix, "saetze")}
    </td>
    <td>
      {!savestatus? "": savestatus.ops.map(s => s.slice(0,1)).join(", ")}
    </td>
    <td>
      {!savestatus? "": savestatus.savestatus}
    </td>
    <td>
      {nr}
    </td>
    <td>{/* Überschrift */}
      <Textarea
        name="wort"
        onChange={(event) => handleZelleChange(event, ix)}
        style={{ backgroundColor: '#ddd', color: submitted ? satztypen[typ] : null, fontWeight }}
        type="text"
        value={wort}
      />
    </td>
    <td>{/* Satz */}
      <Textarea
        name="worte"
        onChange={(event) => handleZelleChange(event, ix)}
        style={{ backgroundColor: '#eee', color: submitted ? satztypen[typ] : null, fontWeight, width:"98%" }}
        type="text"
        value={worte}
      />
    </td>
    <td>{/* Typ */}
      {!typ ? "" : (
        <div>
        <select
          name="typ"
          onChange={(event) => handleZelleChange(event, ix)}
          style={{ color: satztypen[typ] }}
          value={typ}
        >
          {Object.keys(sortedobj(satztypen)).map(typ => (<option key={typ} value={typ} style={{ color: satztypen[typ], fontWeight }}>{typ}</option>
          ))}
        </select>
        <Textarea
          name="typ"
          onChange={(event) => handleZelleChange(event, ix)}
          style={{ backgroundColor: '#ddd', color: submitted ? satztypen[typ] : null, fontWeight }}
          type="text"
          value={typ}
        />
      </div>
    )}
    </td>
  </tr>
// )}
)

export default SatzEditEintrag;
