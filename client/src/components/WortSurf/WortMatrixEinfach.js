import React, {useState} from "react";
import { Cell, Grid } from "./../CellFold";

const WortMatrixEinfach = ({wortMatrix, ur={ix:0, iy:0}}) => { 
  const [wortmatrix, setWortmatrix] = useState(wortMatrix);
  const [ursprung, setUrsprung] = useState(ur);
  const xBreite = wortmatrix.length;
  const yHoehe = wortmatrix[0].length;  // Wortlisten sollten alle gleich lang sein
  const spalten = [...new Array(xBreite).keys()].map(z=>z-ursprung.ix);
  const zeilen = [...new Array(yHoehe).keys()].map(z=>z-ursprung.iy);
  const areas = zeilen.map(zeile => {   // zeilen[-2, -1, ..., 4, 5], spalten[-2, -1, ..., 4, 5], Ursprung(0, 0)
    let zeilenarr = spalten.map(spalte => `a${spalte}${zeile}`);
    return zeilenarr.join(" ");
  });
  let matrixwort;
  return (
    <div>
      <Grid 
        columns={`repeat(${zeilen}, 500px)`}
        rows={`repeat(${spalten}, 1fr)`}
        gap="5px"
        style={{ margin: "auto" }}
        areas={areas}
      >
        {     
          console.log("----------------------") || console.log({spalten}) || console.log({zeilen}) ||
          zeilen.map(ze => {
          return spalten.map(sp => {
            let zellid = `a${sp}${ze}`;
            matrixwort = wortmatrix[ursprung.ix + sp][ursprung.iy + ze];
            return ( !matrixwort? null:
              <Cell middle 
                start={"true"}
                key={zellid}
                style={{
                  // backgroundColor: matrixwort && matrixwort.detailgrad>=0? detailcolor(matrixwort.detailgrad): "rgb(200,200,200)", 
                  // backgroundColor: !matrixwort? "rgb(200,200,200)": matrixcolor(sp, ze, spalten, zeilen), 
                  borderRadius:"100px"
                }}
                area={zellid}
              >
               {matrixwort}
              </Cell>
            );
          });
        })}
      </Grid>
    </div>
  );
}
export default WortMatrixEinfach;