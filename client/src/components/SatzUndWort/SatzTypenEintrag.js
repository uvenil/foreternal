import React from 'react';


const SatzTypenEintrag = ({ 
  basissatz, 
  handleClick,
  userdata: {user: {satztypen}}, 
  typen, 
  wort, 
}) => (
  <tr>
    <td style={{ color: `${satztypen[basissatz.typ.wort]}` }}>{/* Wort */}
      {(!wort || !wort.wort) ? null : (
        <a
          onClick={() => handleClick.left(wort)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, basissatz.typ); }}
          > 
          {wort.wort}
        </a>
      )}
    </td>
    {typen.map((typ)=>( // eine Spalte pro Satztyp
      <td key={typ} style={{ color: `${satztypen[typ]}` }}>{/* Typ */}
        {wort.satze   // einzele satze, in denen wort enthalten ist
          .filter(satz=> !!satz && satz.typ.wort===typ) // nur die Satze (in denen das Wort vorkommt) in dieser Spalte darstellen, die dem Spalten-Typ entsprechen
          .map(satz=>{
            if (satz._id === basissatz._id)  return null; // nicht den Basis-Satz erneut aufführen
            return (
              <div key={satz._id}>{/* für jeden Satz des gleichen Typs eine Zeile in der Tabellenzelle */}
                <a
                  onClick={() => handleClick.left(satz.wort)}
                  onContextMenu={(e) => { e.preventDefault(); handleClick.right(satz.wort, typ); }} 
                  >
                  {satz.wort.wort // stellvertretend für den Satz die Satzüberschrift darstellen
                  }
                </a>
              </div>
            );
          })
        }
      </td>
      ))
    }
  </tr>
);

export default SatzTypenEintrag;
