import React from "react";
import { useQuery } from 'graphql-hooks';
import WortTable from "./WortTable";
import { CellFold, Cell, Grid } from "./../CellFold";

const WortSteuerung = ({
  matrixwort, 
  updateWortmatrix, 
  deleteMatrixwort,
  matrixNeu,
  cursor, 
  setCursor, 
}) => { 
  if (!matrixwort)  return null;
  const { loading, error, data } = useQuery(GET_WORT_NESTED, {
    variables: {_id: matrixwort.wort._id}
  })
  if (loading) return 'Lädt...'
  if (error) return `Graphql-Fehler: ${error.message}`

  // const matr = [null, [null, undefined], undefined, [1, 2], undefined, [undefined, undefined]];
  // const trim = trimmatrix(matr);
  // console.log({matr});
  // console.log({trim});

  const usatze = data.wort.satze; // Überschriftsworte
  const dsatze = data.wort.satz; // Detailworte
  const wortClicked = cursor && cursor.koord && cursor.koord.x===matrixwort.koord.x && cursor.koord.y===matrixwort.koord.y;
  return (
    <Grid 
      columns={1}
      rows={"1fr auto"}
      gap="1px"
      style={{margin: "auto"}}
      areas={[
        "Überblick",
        "Wort",
        "Details"
      ]}
    >
      <CellFold center middle summary="Überblick" area="Überblick">
        {
          (wortClicked && cursor.liste==="button") || (cursor && cursor.liste==="alleButtons")?
          <button
            onClick={()=> setCursor({
              koord: {...matrixwort.koord},
              liste: "Überblick"
            })}
            style={{backgroundColor:"lightblue", borderRadius:"30px"}}
          >
            {usatze.length}
          </button>:
          (wortClicked && cursor.liste==="Überblick")?
          <WortTable
            handleClick={updateWortmatrix}
            vorkoord={{...matrixwort.koord}}
            wortListe={usatze.map(sa=>sa.wort)}
          />:
          null
        }
      </CellFold>
      <Cell center middle 
        summary="Wort" 
        area="Wort"
        style={{fontWeight:matrixwort.mark.ursprung? 600: 400, display:"block"}}
      >
        {(wortClicked && cursor.liste==="button") || (cursor && cursor.liste==="alleButtons")?
          <button
            style={{padding:0}}
            onClick={matrixNeu}
          >
            O
          </button>:
          null
        }
        <a onClick={()=> 
          cursor===null || cursor.liste===null || 
          (cursor.koord.x!==matrixwort.koord.x || cursor.koord.y!==matrixwort.koord.y)? 
          setCursor({koord: {...matrixwort.koord}, liste: "button"}): 
          setCursor({koord: {...matrixwort.koord}, liste: null})}
        >
          {/* {" " + (!matrixwort.vorkoord? " ": (matrixwort.vorkoord.x + "," + matrixwort.vorkoord.y)) + " " + data.wort.wort + " " + (!matrixwort.koord? " ": (matrixwort.koord.x+ ","  + matrixwort.koord.y)) + " " //  + Math.round(matrixwort.detailgrad*100)/100 */}
          {" " + data.wort.wort + " " //  + Math.round(matrixwort.detailgrad*100)/100
        }
        </a>
        {(wortClicked && cursor.liste==="button") || (cursor && cursor.liste==="alleButtons")?
          <button
            style={{padding:0}}
            onClick={deleteMatrixwort}
          >
            X
          </button>:
          null
        }
      </Cell>
      <CellFold center middle summary="Details" area="Details">
        {
          (wortClicked && cursor.liste==="button") || (cursor && cursor.liste==="alleButtons")?
          <button
            onClick={()=> setCursor({
              koord: {...matrixwort.koord},
              liste: "Details"
            })}
            style={{backgroundColor:"lightgreen", borderRadius:"30px"}}
          >
            {dsatze.length}
          </button>:
          (wortClicked && cursor.liste==="Details")?
          <WortTable
            handleClick={updateWortmatrix}
            vorkoord={{...matrixwort.koord}}
            wortListe={dsatze.map(sa=>sa.worte).flat()}
          />:
          null
        }
      </CellFold>
    </Grid>
  );
}

// kein gql für graphql-hooks!
const GET_WORT_NESTED = `
  query($_id: ID!) {
    wort(_id: $_id) {
      _id
      wort
      satz {
        _id
        typ {_id wort}
        wort {_id wort}
        worte {_id wort}
      }
      satze {
        _id
        typ {_id wort}
        wort {_id wort}
        worte {_id wort}
      }
      stopuser
      typuser
      color
      username
    }
  }
`;

export default WortSteuerung;