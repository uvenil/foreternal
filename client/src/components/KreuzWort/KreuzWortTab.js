import React, { Fragment } from "react";

import Ueberblick from "./../KreuzWort/Ueberblick";
import BasisSatz from "./../KreuzWort/BasisSatz";
import Details from "./../KreuzWort/Details";


const KreuzWortTab = ({ ...props, maxWorte, satz, tiefe, userdata } ) => {
  const stopworte = userdata.user.stopworte.map(wo => wo.wort);
  return (
    (!satz) ? <p>Keine Sätze vorhanden</p> : (
    <div className="App table-wrapper">
      <table>
        <colgroup>
          {
            [...Array(Math.floor((maxWorte+3)/2)).keys()].map(z => 
              <Fragment  key={z}>
                <col style={{backgroundColor: '#ddd'}}></col>
                <col style={{backgroundColor: '#eee'}}></col>
              </Fragment>
            )
          }
          <col style={{backgroundColor: '#ddd'}}></col>
        </colgroup>

        <thead>
          <tr>
            <th>{satz.wort.wort}</th>
            {
              satz.worte.slice(0, maxWorte).map((wo, ix) => 
                <th key={!wo? ix: wo._id + ix}>{!wo? null: wo.wort}</th>
              )
            }
            <th>Subtyp</th>
            <th style={{ backgroundColor: "blue" }}>Überblick</th>

          </tr>
        </thead>

        <tbody>
          {tiefe>3 && (
            <Ueberblick {...props} 
              maxWorte={maxWorte}
              satz={satz}
              stopworte={stopworte}
            />
          )}

          <BasisSatz {...props} 
            maxWorte={maxWorte}
            satz={satz}
            stopworte={stopworte}
          />

          {(tiefe===3 || tiefe>4) && (
            <Details {...props} 
              maxWorte={maxWorte}
              satz={satz}
              stopworte={stopworte}
            />
          )}

          <tr>
            <th>{satz.wort.wort}</th>
            {
              satz.worte.slice(0, maxWorte).map((wo, ix) => 
                <th key={!wo? ix: wo._id + ix}>{!wo? null: wo.wort}</th>
              )
            }
            <th>Subtyp</th>
            <th style={{ backgroundColor: "green" }}>Details</th>

          </tr>
        </tbody>
      </table>
    </div>
    )
  );
}

export default KreuzWortTab;
