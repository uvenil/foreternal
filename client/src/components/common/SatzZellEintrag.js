// aus: https://github.com/styled-components/styled-components

import React from 'react';
import untersatzTypen from "../../util/untersatzTypen";

// import styled from 'styled-components';

// const Wortlink = styled.a`
//   text-decoration: none;
//   font-size: 1rem;
//   text-align: left;
// `;

// DoubleClick sind gleichzeitig zwei SingleClicks zum Unterbinden sh.
// https://stackoverflow.com/questions/8809680/how-to-handle-both-dblclick-and-click-events-on-calendar-event#8810104

const basisSatzStyle = {
  backgroundColor: "#f8f8f8",
  fontSize:"1.1rem",
  fontWeight: "bold",
}

const SatzZellEintrag = ({ 
  ersteZeile=false, 
  handleChange, 
  handleClick, 
  maxWorte=900,
  satztypen, 
  satz, 
  satz: {typ, wort, worte}, 
  zelleid 
}) => {
  const typObj = typ;
  typ = typ.wort;
  return (
    <tr style={!ersteZeile? {color: satztypen[typ]}: {color: satztypen[typ], ...basisSatzStyle}}>
      <td>{/* Überschrift */}
        {(!wort) ? "" : (
        <a
          onClick={() => handleClick.left(wort, typ, zelleid)} 
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }} 
          >
          {wort.wort || wort}
        </a>
        )}
      </td>
      <td>{/* Satz */}
        {worte && worte.filter(w=>!!w).slice(0, maxWorte).map((wort, ix) => (
          <a
            key={String(wort) + ix}
            onClick={() => handleClick.left(wort, typ, zelleid)}
            onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
            >
            {(wort.wort || wort) + " "}
          </a>
        )
        )}
      </td>
      <td>{/* Typ */}
        {!typ ? "" : (
          (ersteZeile===false || !(satz.wort&&satz.wort.satz&&satz.wort.satz.length>1)) ? (
            <a
              onClick={() => handleClick.left(typObj, typ, zelleid)}
              onContextMenu={(e) => { e.preventDefault(); handleClick.right(typ, typ); }}
            >
              {typ}
            </a>
          ) : (
            <select
              name="satztyp"
              onChange={handleChange}
              onClick={() => handleClick.left(typObj, typ, zelleid)}
              style={!ersteZeile? {color: satztypen[typ]}: {color: satztypen[typ], ...basisSatzStyle}}
              value={typ}
            >
              {[typ, ...untersatzTypen.wortsatzTypen(satz)].map((typ, ix) => (<option key={ix} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>
              ))}
            </select>
          )
        )}
      </td>
    </tr>
  );
}

export default SatzZellEintrag;


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
