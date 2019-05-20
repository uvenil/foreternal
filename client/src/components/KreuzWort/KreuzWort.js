import React from "react";

import KreuzWortTab from "./KreuzWortTab";      // Überschriften + Satze
import untersatzTypen from "../../util/untersatzTypen";
import { CellFold, Grid } from "./../CellFold";


const KreuzWort = ({ 
  children,
  handleChange, 
  handleClick, 
  maxWorte,
  rtg, 
  satz, 
  satz: {typ, wort, worte},
  satztypen, 
  subtyp, 
  tiefe, 
  userdata,
  zelleid,
  ...props 
}) => (
  <Grid
    columns={"auto 1fr"}
    // rows={"1fr auto 1fr"}
    gap="2px"
    areas={[
      "tab zelle",
      // "basissatz typauswahl",
      // "details frei2"
    ]}
    style={{
      backgroundColor: "#eee",
      border: "2px solid lightgrey",
      boxShadow: "-3px 3px 5px 0px rgba(168, 168, 168, 0.7)",
      margin: "0.2rem",
      position: "relative",
    }}
  >
    <CellFold area="zelle" summary="Zellstrg" style={{ position: "relative" }}>
        {children   // this.props.children zum EInfügen der ZellSteuerung in SatzZelle.js
          }
      </CellFold>

    {(tiefe>2) && (
      <CellFold center middle summary="KreuzWort-Tabelle" area="tab">
        <KreuzWortTab {...props} 
          handleChange={handleChange}
          handleClick={handleClick}
          maxWorte={Math.min(maxWorte, satz.worte.length)}
          satz={satz}
          satztypen={satztypen}
          subtyp={subtyp}
          tiefe={tiefe}
          userdata={userdata}
          zelleid={zelleid}
        />
      </CellFold>
    )}

    {(tiefe===1 || tiefe===2) && (   // nur Basis-wort, -satz bei tiefe 1 und 2
      <CellFold center middle summary="Basissatz" area="tab" style={{ color: `${satztypen[satz.typ.wort]}` }}>
        <table border="3px solid black" >
        <tbody>
        <tr style={{ 
          backgroundColor:"white", 
          border:`3px solid ${satztypen[typ.wort]}`, 
          color: `${satztypen[typ.wort]}`, 
          fontSize:"1.1rem", 
          fontWeight:"bold" 
        }}>
          <td>{/* Überschrift */}
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
          {tiefe===2 && (
            worte && worte.slice(0, maxWorte).map((wort, ix) => (
              <td key={wort._id + ix} >
                <a
                  onClick={() => handleClick.left(wort, typ, zelleid)}
                  onContextMenu={(e) => { e.preventDefault(); handleClick.right(wort, typ); }}
                  >
                  {` ${wort.wort}`}
                </a>
              </td>
            ))
          )}
          <td>{/* Satztyp */}
            <select
              name="satztyp"
              onChange={handleChange}
              style={{ color: satztypen[satz.typ.wort] }}
              value={satz.typ.wort}
            >
              {[satz.typ, ...untersatzTypen.wortsatzTypen(satz)].map(typ => (<option key={typ} value={typ} style={{ color: satztypen[typ.wort] }}>{typ}</option>
              ))}
            </select>
          </td>
        </tr>
        </tbody>
        </table>
      </CellFold>
    )
  }
  </Grid>
);

export default KreuzWort;
