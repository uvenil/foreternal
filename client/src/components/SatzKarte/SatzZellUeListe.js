import React from "react";

const SatzZellUeEintrag = ({ handleClick, typ, wort, userdata:{user:{satztypen}}, zelleid }) => (
  <tr style={{ color: `${satztypen[typ.wort]}` }}>
    <td>{/* Überschrift */}
      {(!wort || !wort.wort) ? "" : (
      <a
        onClick={() => handleClick.left(wort, typ, zelleid)} 
        onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }} 
        >
        {wort.wort}
      </a>
      )}
    </td>
  </tr>
);

const SatzZellUeListe = ({ satzListe, ...props} ) => (
  (satzListe && satzListe.length>0) ? (
  <div className="App table-wrapper">
    <table>
      <colgroup>
        <col style={{backgroundColor: '#ddd'}}></col>
      </colgroup>
      <thead>
        <tr>
          <th>Überschrift</th>
        </tr>
      </thead>
      <tbody>
        {satzListe ? (
          satzListe.map(satz => (
            <SatzZellUeEintrag {...props} key={satz._id} {...satz} />
          )
        )) : null
        }
      </tbody>
    </table>
  </div>
  ) : <p>Keine Sätze vorhanden</p>
);

export default SatzZellUeListe;
