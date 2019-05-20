import React, {useState} from "react";
import initFilter from "./initFilter";
import {modobjval} from "./../../util/objutils"
import { Grid, Cell } from "./../CellFold";

const WortFilter = ({handleFilterChange, wortFilter}) => { 
  if (typeof wortFilter!=="object" || wortFilter===null || Object.keys(wortFilter).length===0) {
    wortFilter = initFilter;
  }
  const [filter, setFilter] = useState(wortFilter); 
  const changed = JSON.stringify(filter)!==JSON.stringify(wortFilter);
  return (
    <div>
      {/* Filter */}
      <Grid 
        columns={"1fr 1fr auto"}
        rows={5}
        gap="1px"
        style={{border: "2px solid grey", margin: "2px"}}
        areas={[
          "t b4 b1",
          "c1 c2 b2",
          "c3 c4 b3",
          "c5 c6 v1",
          "c7 c8 v2",
          "c9 c10 v3",
          "c11 c12 v4",
        ]}
      >
        {/* Buttons */}
        <Cell area="t">
          <strong
            style={{textDecoration:"underline"}}
          >
            Filter
          </strong>
        </Cell>
        <Cell area="b4">
          <button
            onClick={() => setFilter(filter => ({...filter, boolean: modobjval(filter.boolean, v=>!v)}) )}
            >
            Auswahl umkehren
          </button>
        </Cell>
        <Cell area="b1">
          <button
            disabled={!changed}
            onClick={() => handleFilterChange(filter)}
            style={changed? {backgroundColor:"lightgreen", fontWeight:600}: 
              {backgroundColor:"lightgrey", color:"grey", fontWeight:400}}
          >
            Anwenden
          </button>
        </Cell>
        <Cell area="b2">
          <button
            onClick={() => setFilter(filter => ({...filter, boolean: modobjval(filter.boolean, ()=>false)}) )}
            >
            Alles abwählen
          </button>
        </Cell>
        <Cell area="b3">
          <button
            onClick={() => setFilter(filter => ({...filter, boolean: modobjval(filter.boolean, ()=>true)}) )}
          >
            Alles auswählen
          </button>
        </Cell>
        { // Filter-Checkboxen
          Object.keys(filter.boolean).map((f, ix) => {
          // console.log({f});
            if (!filter.boolean.hasOwnProperty(f))  return null;
            return (
              <Cell
                key={ix}
                area={"c"+(ix+1)}
              >
                <input  className="checkbox"
                  checked={filter.boolean[f]} 
                  id={f}
                  onChange={() => setFilter(filter => ({
                    ...filter, 
                    boolean: {
                      ...filter.boolean, 
                      [f]: !filter.boolean[f]
                    },
                  }))}
                  type="checkbox"
                  value={filter.boolean[f]}
                />
                <label htmlFor={f}>{f}</label>
              </Cell>
            );
          })
        }
        { // Zahleninput
          Object.keys(filter.values).map((v, ix) => {
          // console.log({v});
            if (!filter.values.hasOwnProperty(v))  return null;
            return (
              <Cell
                key={ix}
                area={"v"+(ix+1)}
              >
                <input
                  name={v}
                  onChange={(e) => {
                    e.persist();
                    setFilter(filter => ({
                      ...filter, 
                      values: {
                        ...filter.values, 
                        [v]: Math.max(1, Math.round(e.target.value)),
                      },
                    }))
                  }}
                  style={{width:"2.5rem"}}
                  type="number"
                  value={filter.values[v]}
                />
              </Cell>
            );
          })
        }
      </Grid>
    </div>
  );
}

export default WortFilter;