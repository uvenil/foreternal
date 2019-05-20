import React from "react";

import { Grid, Cell} from "./../CellFold";
import { INLINE_FRAGMENT } from "graphql/language/kinds";


const ZellSteuerung = ({ 
  compix, 
  compnames,
  handleChange, 
  maxWorte,
  tiefe, 
  ...props 
}) => (

<form
  className="form"
  onSubmit={event => this.handleSubmit(event)}
  style={{ margin: 0, padding: 0 }}
>
  <Grid
    columns={"1fr auto"}
    rows={"repeat(2, auto)"}
    gap="2px 4px"
    areas={[
      "zelltyp tiefe",
      "text wortanzahl",
    ]}
    style={{
      background: "lightgrey",
      border: "1px solid darkgrey",
      color: "black",
      fontSize:"0.7rem", 
      margin: "0.1rem",
      opacity: 0.9,
      padding: "0.1rem",
    }}
  >
    <Cell area="tiefe" center>
    <select
      name="tiefe"
      onChange={handleChange}
      value={tiefe}
    >
      {[...Array(10).keys()].map(t => <option key={t} value={t}>{t}</option>)}
    </select>
    </Cell>
    <Cell area="zelltyp">
    <select
      name="compix"
      onChange={handleChange}
      value={compix}
    >
      {compnames.map(cn => <option key={cn} value={compnames.findIndex(c => c===cn)}>{cn}</option>)}
    </select>
    </Cell>
    <Cell area="text">
    <label htmlFor="maxWorte">Max. Wortanzahl<br /> pro Satz</label>
    </Cell>
    <Cell area="wortanzahl">
    <input
      min="0"
      name="maxWorte"
      onChange={handleChange}
      style={{fontSize:"0.7rem", width:"2.5rem"}}
      type="number"
      value={maxWorte}
    />
    </Cell>
  </Grid>
</form>
);

export default ZellSteuerung; // compnames.findIndex(cn)
