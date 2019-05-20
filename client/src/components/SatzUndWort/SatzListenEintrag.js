import React, {Fragment} from 'react';


const SatzListenEintrag = ({ 
  basissatz, 
  handleClick,
  userdata: {user: {satztypen}}, 
  wort, 
}) => (
  <tr>
    <td style={{ color: `${satztypen[basissatz.typ.wort]}` }}>{/* Überschrift */}
      {(!wort || !wort.wort) ? "" : (
        <a
          onClick={() => handleClick.left(wort)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, basissatz.typ); }} 
          >
          {wort.wort}
        </a>
      )}
    </td>
    {wort.satz.map((satz)=>{  // satze durchlaufen, dei denen das aktuelle wort die Überschrift bildet
      if (satz._id === basissatz._id) return null; // nicht den Basis-Satz erneut aufführen
      return (
        <Fragment key={satz._id}>
          <td style={{ color: `${satztypen[satz.typ.wort]}` }}>{/* Satz */}
            {satz.worte && satz.worte.map((wort, ix) => (
              <a
                key={wort._id + ix}
                onClick={() => handleClick.left(wort)}
                onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, satz.typ); }} 
                >
                {wort.wort + " "}
              </a>
            )
            )}
          </td>
          <td style={{ color: `${satztypen[satz.typ.wort]}` }}>{/* Typ */}
            {satz.typ ? (
              <a
                to={`/satze/${satz._id}`}
                onClick={() => handleClick.left(satz.typ)}
                onContextMenu={(e) => { e.preventDefault(); handleClick.right(satz.typ, satz.typ); }}
                onDoubleClick={(e) => { e.preventDefault(); handleClick(satz.typ); }}
                >
                {satz.typ.wort}
              </a>) : ""}
          </td>
        </Fragment>
    );})}
  </tr>
);

export default SatzListenEintrag;
