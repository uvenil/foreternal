import React from "react";

import { Grid, Cell} from "./../CellFold";


const TrennEingabe = ({ 
  formatName,
  handleChange, 
  inputFormats,
  satztrenn,
  subuebtrenn,
  uebtrenn
}) => (
  <Grid
    columns={"repeat(2, auto)"}
    rows={"repeat(4, auto)"}
    gap="2px 4px"
    areas={[
      "LformatName formatName",
      "Lsatztrenn satztrenn",
      "Lsubuebtrenn subuebtrenn",
      "Luebtrenn uebtrenn",
      "frei legende",
    ]}
    style={{
      // background: "lightgrey",
      // border: "1px solid darkgrey",
      color: "black",
      fontSize:"1rem", 
      margin: "0.1rem",
      opacity: 0.9,
      padding: "0.1rem",
      width: "100%"
    }}
  >
    <Cell area="LformatName">
      <label className="strong" htmlFor="formatName">Eingabeformat</label>
    </Cell>
    <Cell area="formatName">
      <select
        name="formatName"
        onChange={handleChange}
        style={{ fontWeight:600 }}
        value={formatName}
      >
        {Object.keys(inputFormats).map(fo => <option key={fo} style={{ fontWeight:600 }} value={fo}>{fo}</option>)}
      </select>
    </Cell>
    <Cell area="Lsatztrenn">
      <label className="strong" htmlFor="satztrenn">Satz-Trennung</label>
    </Cell>
    <Cell area="satztrenn">
      <input
        name="satztrenn"
        onChange={handleChange}
        style={{width:"2.5rem"}}
        type="text"
        value={satztrenn}
      />
    </Cell>
    <Cell area="Lsubuebtrenn">
      <label className="strong" htmlFor="subuebtrenn">Subüberschrift-Trennung</label>
    </Cell>
    <Cell area="subuebtrenn">
      <input
        name="subuebtrenn"
        onChange={handleChange}
        style={{width:"2.5rem"}}
        type="text"
        value={subuebtrenn}
      />
    </Cell>
    <Cell area="Luebtrenn">
      <label className="strong" htmlFor="uebtrenn">Überschrift-Trennung</label>
    </Cell>
    <Cell area="uebtrenn">
      <input
        name="uebtrenn"
        onChange={handleChange}
        style={{width:"2.5rem"}}
        type="text"
        value={uebtrenn}
      />
    </Cell>
    <Cell area="legende" style={{fontSize:"0.7rem"}}>
      (\n = Zeilenumbruch)
    </Cell>
  </Grid>
);

export default TrennEingabe; // compnames.findIndex(cn)
