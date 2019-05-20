// aus: https://github.com/styled-components/styled-components

import React from 'react';
import untersatzTypen from "../../util/untersatzTypen";


const Details = ({ 
  satz: { wort, worte }, 
  satz,
  subtyp,
  handleClick, 
  maxWorte, 
  satztypen, 
  stopworte,
  zelleid
}) => (
  untersatzTypen.subtypliste(satz, subtyp, "Details").map((subtyp, ix) => (  // alle möglichen Untersatztypen durchlaufen
    <tr key={ix} style={{ color: `${satztypen[subtyp]}` }}>
      <td>
      { // Überschrift des Basissatzes
        stopworte.includes(wort.wort)? null:
        !wort.satz ? "kein Satz!" : ( 
          wort.satz.filter(sa => sa.typ.wort===subtyp).map((sa, ix) => (
            <a
              key={sa._id + ix}
              onClick={() => handleClick.left(sa.wort, sa.typ, zelleid)}
              onContextMenu={(e) => { e.preventDefault(); handleClick.right(sa.wort, sa.typ); }}
            >
              {sa.wort.wort+" "}
            </a>
          ))
        )}
      </td>

      { // Worte im Basissatz
        !worte ? "keine Worte!" : ( 
          worte.slice(0, maxWorte).map((wo, ix) => ( 
            stopworte.includes(wo.wort)? <td key={ix}></td>:
            <td key={ix}>
            { // Satze mit dem gewünschteen Subtyp, für die die Worte im Basissatz die Überschrift (hier: sa.wort.wort===wo.wort) bilden
              !wo? null:
              wo.satz.filter(sa => sa.typ.wort===subtyp).map(sa => (
                <a
                  key={sa._id + ix}
                  onClick={() => handleClick.left(sa.wort, sa.typ, zelleid)}
                  onContextMenu={(e) => { e.preventDefault(); handleClick.right(sa.wort, sa.typ); }}
                >
                  {sa.wort.wort+" "}
                </a>
              ))
            }
            </td>
          ))
        )}

      <td>
        { // Typ der darzustellenden Untersatz-Überschriften
          !subtyp ? null : ( 
          <a
            onClick={() => handleClick.left(subtyp, subtyp, zelleid)}
            onContextMenu={(e) => { e.preventDefault(); handleClick.right(subtyp, subtyp); }}
          >
            {subtyp}
          </a>
        )}
      </td>

      <td style={{ backgroundColor: "green" }}>
      </td>
    </tr>
  ))
);

export default Details;
