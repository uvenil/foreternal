import React, { Fragment } from "react";

import { Cell, Grid } from "./../CellFold";
import untersatzTypen from "../../util/untersatzTypen";


const rtgfarbe = { 
  "Details": "green", 
  "Überblick": "blue"
}

const SatzKopf = ({ 
  handleChange, 
  handleClick, 
  rtg, 
  satz, 
  satztyp, 
  satztypen, 
  subtyp,
  tiefe,
  zelleid 
}) => (
  <form
    className="form"
    onSubmit={event => this.handleSubmit(event)}
  >
    <h3 style={{ padding: 0, margin: 0 }}>
      <Grid
        columns={"1fr auto"}
        rows={"repeat(2, 1fr)"}
        gap="5px 10px"
        areas={(tiefe>2 && tiefe<5) ? [
          "wort wortinput",
          "typ typinput",
          "rtg rtginput",
          "subtyp subtypinput"
        ] : (tiefe<3 ?
          [
          "wort wortinput",
          "typ typinput",
        ] :
        [
          "rtg rtginput",
          "subtyp subtypinput"
        ]
        )
        }
        style={{
          background: "lightgrey",
          border: "1px solid darkgrey",
          color: "black",
          margin: "0.2rem",
          opacity: 0.9,
          padding: "0.2rem",
        }}
      >
        {tiefe<5 && (
          <Fragment>
                  {/* {(()=>{
      console.log("rtg", rtg);
      })()} */}
            <Cell area="wort">
              <strong><label htmlFor="satzwort">Satzwort</label></strong>
            </Cell>
            <Cell area="wortinput" style={{ color: `${satztypen[satz.typ.wort]}` }} >
              <a
                onClick={() => handleClick.left(satz.wort, satz.typ, zelleid)}
                onContextMenu={(e) => { e.preventDefault(); handleClick.right(satz.wort, satz.typ); }}
                style={{ border: `2px solid ${satztypen[satz.typ.wort]}`, margin: 0, padding: "0rem 0.3rem" }}
              >
                {satz.wort.wort}
              </a>
            </Cell>
            <Cell area="typ"><strong>Satztyp</strong></Cell>
            <Cell area="typinput">
              <select
                name="satztyp"
                onChange={handleChange}
                style={{ color: satztypen[satz.typ.wort] }}
                value={satz.typ.wort}
              >
                {[satz.typ.wort, ...untersatzTypen.wortsatzTypen(satz)].map(typ => (<option key={typ} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>
                ))}
              </select>
            </Cell>
          </Fragment>
        )}
        {tiefe>2 && (
          <Fragment>
            <Cell area="subtyp"><strong>Subtyp</strong></Cell>
            <Cell area="subtypinput">
              <select
                name="subtyp"
                onChange={handleChange}
                value={subtyp}
                style={{ color: satztypen[subtyp] }}
              >
                {rtg==="Details" ? 
                  [...new Set([...untersatzTypen.wortesatzTypen(satz), "Alle", "Satztyp", subtyp].sort())].map(typ => 
                    (<option key={typ} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>))
                  :
                  [...new Set([...untersatzTypen.wortesatzeTypen(satz), "Alle", "Satztyp", subtyp].sort())].map(typ =>
                    (<option key={typ} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>))
                }
              </select>
            </Cell>
            <Cell area="rtg">
              <strong>Richtung: </strong>
            </Cell>
            <Cell area="rtginput">
              <input
                checked={rtg==="Details"}
                id={"Details"+String(zelleid)}
                name="rtg"
                onChange={handleChange}
                type="radio"
                value="Details"
              />              
              <label htmlFor={"Details"+String(zelleid)}
                style={{ color: rtgfarbe["Details"] }}
              >
                Details 
              </label>
              <input
                checked={rtg==="Überblick"}
                id={"Überblick"+String(zelleid)}
                name="rtg"
                onChange={handleChange}
                type="radio"
                value="Überblick"
              />              
              <label htmlFor={"Überblick"+String(zelleid)}
                style={{ color: rtgfarbe["Überblick"] }}
              >
                Überblick 
              </label>
            </Cell>
          </Fragment>
        )}
      </Grid>
    </h3>
  </form>
);

export default SatzKopf;
