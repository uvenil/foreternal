// aus: https://github.com/styled-components/styled-components

import React from 'react';
import untersatzTypen from "../../util/untersatzTypen";

const basisSatzStyle = {
  backgroundColor: "#f8f8f8",
  fontSize:"1.1rem",
  fontWeight: "bold",
}

const BasisSatz = ({ 
  satz: { typ, wort, worte }, 
  satz,
  subtyp,
  handleClick, 
  handleChange, 
  maxWorte, 
  satztypen, 
  wortsatzTypen,
  zelleid,
  ...props 
}) => (
  <tr style={{ 
    border:`2px solid ${satztypen[typ.wort]}`, 
    color: `${satztypen[typ.wort]}`, 
    ...basisSatzStyle,
  }}>
    <td style={{borderLeft:`2px solid ${satztypen[typ.wort]}`}}>{/* Überschrift */}
      {(!wort || !wort.wort) ? "" : (
      <a
        onClick={() => handleClick.left(wort, typ, zelleid)} 
        onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }} 
        style={{textDecoration: "underline"}}
        >
        {wort.wort}
      </a>
      )}
    </td>

    {/* Satz */}
    {worte && worte.slice(0, maxWorte).map((wort, ix) => (
      <td key={!wort? ix: wort._id + ix} >
        <a
          onClick={() => handleClick.left(wort, typ, zelleid)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
          >
          {!wort? null: wort.wort}
        </a>
      </td>
    ))}

    {/* Satztyp */}
    <td style={{borderRight:`2px solid ${satztypen[typ.wort]}`}}>
      {(!(satz.wort&&satz.wort.satz&&satz.wort.satz.length>1)) ? (
        <a
          onClick={() => handleClick.left(satz.typ, satz.typ.wort, zelleid)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(satz.typ, satz.typ.wort); }}
        >
          {satz.typ.wort}
        </a>
      ) : (
        <select
          name="satztyp"
          onChange={handleChange}
          style={{ color: satztypen[satz.typ.wort], ...basisSatzStyle }}
          value={satz.typ.wort}
        >
          {[satz.typ.wort, ...untersatzTypen.wortsatzTypen(satz)].map((typ, ix) => (<option key={ix} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>
          ))}
        </select>
      )}
    </td>

    <td>{/* Subtyp */}
      {/* {(!(satz.wort&&satz.wort.satz&&satz.wort.satz.length>1)) ? (
        <a
          onClick={() => handleClick.left(typ, subtyp, zelleid)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(typ, subtyp); }}
        >
          {subtyp}
        </a>
      ) : ( */}
        <select
          name="subtyp"
          onChange={handleChange}
          style={{ color: satztypen[subtyp] }}
          value={subtyp}
        >
          {
            [...new Set([...untersatzTypen.alleTypen(satz), "Alle", "Satztyp", subtyp].sort())].map(typ => 
              (<option key={typ} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>))
          }
        </select>
      {/* )} */}
    </td>

</tr>


);

export default BasisSatz;


// <td>{/* Satz */}
//   {worte.map((wort, ix) => (
//     <a
//       key={wort._id + ix}
//       to={`/satze/${wort._id}`}
//       onClick={() => handleClick(wort)}
//       onContextMenu={(e) => { e.preventDefault(); handleClick(wort); }}
//       onDoubleClick={(e) => { e.preventDefault(); handleClick(wort); }}>
//       {wort.wort + " "}
//     </a>
//   )
//   )}
// </td>
