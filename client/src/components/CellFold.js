import React from "react";
import { Cell, Grid } from "styled-css-grid";
import fold from "./HOC/fold";

const Fold = fold();  
const CellFold = ({summary, style, ...props}) => (
  <Cell {...props} 
    style={{...style, overflow: "hidden", width: "100%"}}
  >
    <Fold {...props} 
      style={{...style, width: "100%"}} 
      summary={summary}
    >
      {props.children}
    </Fold>
  </Cell>
);

export { CellFold, Fold, Cell, Grid };