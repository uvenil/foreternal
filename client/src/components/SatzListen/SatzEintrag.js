import React from "react";
import { Link } from "react-router-dom";

import {formatDate} from "../../util/formatSatze"

// const divStyle = {
//   border: "1px solid black",
//   width: "700px",
//   overflow: "hidden",
//   whiteSpace: "nowrap",
//   display: "flex"
// }

const SatzEintrag = ({ 
  _id, 
  typ, 
  wort, 
  worte, 
  worteIf, 
  createdDate, 
  username, 
  userdata: {user: {satztypen}}, 
  handleClick, 
  zix,
}) => (
  <tr style={{ color: `${satztypen[typ.wort]}` }}>
    <td>
      {(!wort || !wort.wort) ? "" : (
        <a
          // to={zix>=0? "": `/worte/surf/${_id}`}
          onClick={(() => handleClick.left(wort))}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
        >
          {wort.wort}
        </a>
      )}
    </td>
    <td>{/* Satz */}
      {worte && worte.filter(w=>!!w).map((wort, ix) => (
        <a
          key={wort._id + ix}
          onClick={() => handleClick.left(wort)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
        >
          {wort.wort + " "}
        </a>
      )
      )}
    </td>
    <td>{typ.wort}</td>
    <td>{worteIf && worteIf.map(wort => {
      if (!wort || !wort.wort) return "";
      return wort.wort;
    }).join(", ")}</td>
    <td>{formatDate(createdDate)}</td>
    <td>{username}</td>
  </tr>
);

export default SatzEintrag;

//         {(!!wort && !!wort.wort) ? wort.wort : ""}
/*
      {
        (() => {
          console.log("wort.wort",wort.wort);

        })()
      }
*/