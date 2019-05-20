// aus: https://github.com/styled-components/styled-components

import React from 'react';
// import { Link } from "react-router-dom";

// import styled from 'styled-components';

// const Wortlink = styled.a`
//   text-decoration: none;
//   font-size: 1rem;
//   text-align: left;
// `;

// DoubleClick sind gleichzeitig zwei SingleClicks zum Unterbinden sh.
// https://stackoverflow.com/questions/8809680/how-to-handle-both-dblclick-and-click-events-on-calendar-event#8810104

const SatzKurzEintrag = ({ 
  handleClick,
  userdata: {user: {satztypen}}, 
  typ, 
  wort, 
  worte, 
}) => {
  // typ = typ.wort;
  return (
    <tr style={{ color: `${satztypen[typ.wort]}` }}>
      <td>{/* Überschrift */}
        {(!wort || !wort.wort) ? "" : (
        <a
          onClick={() => handleClick.left(wort)} 
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }} 
          >
          {wort.wort}
        </a>
        )}
      </td>
      <td>{/* Satz */}
        {worte && worte.map((wort, ix) => (
          <a
            key={wort._id + ix}
            onClick={() => handleClick.left(wort)}
            onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
            >
            {wort.wort+" "}
          </a>
        )
        )}
      </td>
      <td>{/* Typ */}
        {typ ? (
          <a
          onClick={() => handleClick.left(typ)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(typ, typ); }}
          >
          {typ.wort}
        </a>) : ""}
      </td>
    </tr>
  );
}

export default SatzKurzEintrag;


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
