import React, {useState} from "react";
import WortSteuerung from "./WortSteuerung";
import PosSel from "./PosSel";
import {matrixwortUr} from "./matrixwort";
import {trimmatrix} from "./../../util/arrutils";
import { Cell, CellFold, Grid } from "./../CellFold";

const WortMatrix = ({wortMatrix, userdata}) => { 
  // 1. Selektion der Auswahlliste aus wortmatrix -> Cursor auf Auswahlliste {koord:{x, y}, liste}
  // 2. Selektion des Worts aus Auswahlliste -> Cursor auf null, wortmatrix ergänzen

  const [cursor, setCursor] = useState({koord: {x:0, y:0}, liste: "button"}); 
  const [neuwortPos, setNeuwortPos] = useState("daneben"); 
  const [ursprung, setUrsprung] = useState({ix:0, iy:0});
  const [wortmatrix, setWortmatrix] = useState(wortMatrix);
  // cursor: {koord:{x, y}, liste}  ; zeigt auf die aktuell ausgewählte Auswahlliste, Koord bzgl. Wortursprung
  // ursprung: {ix, iy}, Indices des Ursprungswortes in der wortmatrix
  // wortmatrix[ix][iy] = matrixwortStd = {wort, koord:{x,y}, vorkoord:{x,y}, mark:{au, ad, st}, detailgrad}
  // ix, iy = Indices in wortmatrix
  // x, y = Koordinaten bzgl. Ursprungswort
  console.log({wortmatrix, ursprung, cursor, neuwortPos});
  const xBreite = wortmatrix.length;
  const yHoehe = wortmatrix[0].length;  // Wortlisten sollten alle gleich lang sein
  const spalten = [...new Array(xBreite).keys()].map(z=>z-ursprung.ix);
  const zeilen = [...new Array(yHoehe).keys()].map(z=>z-ursprung.iy);
  const areas = zeilen.map(zeile => {   // zeilen[-2, -1, ..., 4, 5], spalten[-2, -1, ..., 4, 5], Ursprung(0, 0)
    let zeilenarr = spalten.map(spalte => `a${spalte}${zeile}`);
    return zeilenarr.join(" ");
  });

  const detailcolor = detailgrad => { // matrixwort.detailgrad [0, 1]
    const lightblue = [173, 216, 230];  // detailgrad 0
    const lightyellow = [255,255,224]; // detailgrad 0.5
    const lightgreen = [144, 238, 144]; // detailgrad 1
    const diffyellow = lightyellow.map((y, ix) => y - lightblue[ix]);
    const diffgreen = lightgreen.map((g, ix) => g - lightyellow[ix]);
    const color = detailgrad<=0.5?
    lightblue.map((b, ix) => b + diffyellow[ix]*detailgrad*2):
    lightyellow.map((y, ix) => y + diffgreen[ix]*(detailgrad-0.5)*2)
    return `rgb(${color[0]},${color[1]},${color[2]})` || "rgb(200,200,200)";  // Bsp.: "rgb(0,192,100)"
  };

  const matrixcolor = (sp, ze, spalten, zeilen) => { // sp = Spalte = x,  ze = Zeile = y,  0 => Ursprung, <0 => Übersicht, >0 Details
    const xRange = Math.max(Math.abs(spalten[0]), Math.abs(spalten[spalten.length-1]));
    const yRange = Math.max(Math.abs(zeilen[0]), Math.abs(zeilen[zeilen.length-1]));
    const xVal = xRange===0? 0: sp / xRange;  // [-1, 1], -1 für max Übersicht, 1 für max Details
    const yVal = yRange===0? 0: ze / yRange;  // [-1, 1], -1 für max Übersicht, 1 für max Details
    let detailgrad = (xVal + yVal)/4 + 0.5; // [-2, 2] => [0, 1], Normierung zwischen 0 und 1
    // console.log({sp, ze});
    // console.log({xRange, yRange});
    // console.log({detailgrad});
    return detailcolor(detailgrad)
  };

  const matrixNeu = nw => () => { // nw = matrixneuwort
    const conf = window.confirm(`Wirklich eine neue Matrix mit dem Wort ${nw.wort.wort} starten?`);
    if (!conf)   return;
    const nwur = matrixwortUr(nw.wort);
    setUrsprung({ix:0, iy:0});
    setCursor({koord: {x:0, y:0}, liste: "button"});
    setWortmatrix([[nwur]]);
  };

  const deleteMatrixwort = ixs => () => {
    let neumatrix = [...wortmatrix];
    let ur;
    if (neumatrix[ixs.ix][ixs.iy].mark.ursprung) {
      const conf = window.confirm("Ursprungswort wirklich löschen?");
      if (!conf)   return;
      ur = {...ursprung, iy:ursprung.iy+1};
    }
    // Wort aus Matrix löschen
    delete neumatrix[ixs.ix][ixs.iy];
    neumatrix = trimmatrix(neumatrix);
    if (neumatrix.length===1 && neumatrix[0].length===1) {  // einzelnes Wort wieder zum Start erklären
      matrixNeu(neumatrix[0][0])();
    }
    // neuen Ursprung finden
    if (!ur) {
      neumatrix.forEach((liste, ix) => {
        if (ur)   return;
        liste.forEach((mwort, iy) => {
          if (mwort.mark.ursprung)  ur = {ix, iy};
        })
      });
    }
    setWortmatrix(neumatrix);
    setUrsprung(ur);
    setCursor({koord: {x:0, y:0}, liste: "button"});
  };

  const updateKoord = (wortmatrix, nix) => {  // passt Koordinaten (bzgl. Ursprung) in der Wortmatrix an, wenn Spalte an Index nix=neuer Index eingefügt werden soll
    let neuwortmatrix = [...wortmatrix];
    const ur = {...ursprung}; // Ursprungswort der Matrix mit den Koordinaten {x:0, y:0}
    const koords = ["koord", "vorkoord"]; // Attribute, die x,y-Koordinaten (bzgl. Ursprung) enthalten
    let ixs = {}; // Objekt mit den x-Indices der Koordinaten
    let neuwort;  // Matrixwort-Index der Spalte
    neuwortmatrix = neuwortmatrix.map((liste) => (
      !liste? liste:
      liste.map(mwort => {  // worte in der Matrix durchlaufen
        if (!mwort)   return mwort;
        neuwort = {...mwort};
        koords.forEach(k => { // Koordinaten-Attribute im Matrixwort durchlaufen
          if (!neuwort[k])   return;
          ixs[k] = neuwort[k]["x"] + ur.ix;  // Umrechnung der x-Koordinate in den Spalten-Index
          if (ur.ix<nix && ixs[k]>=nix)  neuwort[k]["x"]++   // Ursprung befindet sich in linker Matrixhälfte, wort in rechter
          else if (ur.ix>=nix && ixs[k]<nix)  neuwort[k]["x"]--  // Ursprung befindet sich in rechter Matrixhälfte, wort in linker
        })
        return neuwort;
      })
    ));
    return neuwortmatrix;
  };

  const updateWortmatrix = nw => { // nw = matrixneuwort, vw = matrixvorwort
    let neuwortmatrix = [...wortmatrix];
    let ur = {...ursprung};
    let vw = wortmatrix[ur.ix + cursor.koord.x][ur.iy + cursor.koord.y];
    let summand = cursor.liste==="Überblick"? -1: cursor.liste==="Details"? 1: 0;
    let x = vw.koord.x;
    let y = vw.koord.y+summand;
    let listenwechsel = false;
    // yLaenge erweitern
    if ((ur.iy + y)<0) {
      neuwortmatrix = neuwortmatrix.map(liste => [undefined, ...liste]);  // listen um undefined am Anfang verlängern
      ur.iy += 1;
    } else if ((ur.iy + y)>neuwortmatrix[0].length-1) {
      neuwortmatrix = neuwortmatrix.map(liste => [...liste, undefined]);  // listen um undefined am Anfang verlängern
    }
    // Koordinaten des neuen Matrixworts und Vorworts bestimmen
    if (neuwortmatrix[ur.ix + x][ur.iy + y]) {  // Position in der gleichen wortliste besetzt -> überschreiben?
      if (neuwortPos!=="ersetzen") listenwechsel = true;
      if (neuwortPos==="next") {  // nächstmögliche vorhandene Spalte
        let i = 0;
        while (neuwortmatrix[ur.ix + x] && neuwortmatrix[ur.ix + x][ur.iy + y] && i<1000) { // unbesetzte Stelle in der Zeile (ur.iy + y + 1) suchen
          x += summand;
          i++;
        }
        if (i>=1000) {
          alert(`Es konnte kein freier Platz in der Zeile ${(ur.iy + y + 1)} gefunden werden!`);
          return;
        }
        // ggf. xBreite erweitern
        if ((ur.ix + x)<0) {
          neuwortmatrix.unshift(new Array(neuwortmatrix[0].length));  // weitere liste an den Anfang der Matrix stellen
          ur.ix++;
        } else if ((ur.ix + x)>neuwortmatrix.length-1) {
          neuwortmatrix.push(new Array(neuwortmatrix[0].length));  // weitere liste an das Ende der Matrix stellen
        }
      } else if (neuwortPos==="rand") { // Liste zum Rand hinzufügen
        // xBreite erweitern
        if (cursor.liste==="Überblick") {
          neuwortmatrix.unshift(new Array(neuwortmatrix[0].length));  // weitere liste an den Anfang der Matrix stellen
          ur.ix++;
          x = 0 - ur.ix;
        } else if (cursor.liste==="Details") {
          neuwortmatrix.push(new Array(neuwortmatrix[0].length));  // weitere liste an den Anfang der Matrix stellen
          x = neuwortmatrix.length-1 - ur.ix;
        } else {
          console.log("cursor.liste ist weder Überblick noch Details!");
        }
      } else if (neuwortPos==="daneben") {  // Liste in der Nachbarspalte hinzufügen
        // Koordinaten anpssen
        const kix = ur.ix + x; // Index der geklickten Spalte
        const nix = cursor.liste==="Details"? kix+1: kix;  // Index der einzufügenden Spalte
        neuwortmatrix = updateKoord(neuwortmatrix, nix);  // Koordinaten anpssen, bevor die Spalte eingefügt wird
        vw = neuwortmatrix[ur.ix + cursor.koord.x][ur.iy + cursor.koord.y];
        if (ur.ix>=nix)  ur.ix++;  // Spalte vom Ursprung rückt eins nach rechts, wenn Spalte davor eingefügt wird
        x = nix - ur.ix;  // x-Koordinate der neuen Spalte für das neue Wort
        // Spalte einfügen
        neuwortmatrix = [
          ...neuwortmatrix.slice(0, nix),     // linke Matrixhälfte
          new Array(neuwortmatrix[0].length), // eingefügte Spalte
          ...neuwortmatrix.slice(nix),        // rechte Matrixhälfte
        ];
      }
    };
    // Variablen von nw und vw setzen
    nw.koord = {x, y};
    nw.vorkoord = {...vw.koord};
    nw.detailgrad = 
      cursor.liste==="Überblick"? Math.max(0, vw.detailgrad-0.25): 
      cursor.liste==="Details"? Math.min(1, vw.detailgrad+0.25): 0.5;
    if (vw.vorkoord) {  // vorkoord, koord, ix beim wort anzeigen lassen!
      let vvw = neuwortmatrix[ur.ix + vw.vorkoord.x][ur.iy + vw.vorkoord.y];
      vw.detailgrad = (nw.detailgrad + vvw.detailgrad*2) / 3;
    }
    if (listenwechsel) {
      nw.mark.start = true;
      if (cursor.liste==="Überblick") vw.mark.abu = true;
      if (cursor.liste==="Details")   vw.mark.abd = true;
    }
    neuwortmatrix[ur.ix + nw.koord.x][ur.iy + nw.koord.y] = nw;
    neuwortmatrix[ur.ix + vw.koord.x][ur.iy + vw.koord.y] = vw;
    // console.log({x});
    // console.log({neuwortmatrix});
    setWortmatrix(neuwortmatrix);
    setUrsprung(ur);
    setCursor({koord: {...nw.koord}, liste: "button"});
  };

  let matrixwort;
  return (
    <div>
      <Grid 
        columns={1}
        rows={1}
        gap="5px"
        style={{ margin: "auto" }}
      >
      <CellFold summary="Einstellungen">
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <div>
            <input  className="checkbox"
              checked={cursor && cursor.liste==="alleButtons"} 
              id={cursor}
              onChange={()=>
                setCursor(cursor=>!cursor? ({liste:"alleButtons"}): ({koord:{...cursor.koord}, liste:cursor.liste!=="alleButtons"? "alleButtons": null}))
              }
              type="checkbox"
              value={cursor}
            />
            <label htmlFor={"alleButtons"}> alle Buttons anzeigen</label>
          </div>
          <PosSel
            neuwortPos={neuwortPos}
            setNeuwortPos={setNeuwortPos}
          />
        </div>
      </CellFold>
      </Grid>
      <hr/>
      <Grid 
        columns={`repeat(${zeilen}, 500px)`}
        rows={`repeat(${spalten}, 1fr)`}
        gap="5px"
        style={{ margin: "auto" }}
        areas={areas}
        // areas={["check", ...areas]}
      >
        {     
          // console.log("----------------------") || console.log({spalten}) || console.log({zeilen}) ||
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
                  backgroundColor: !matrixwort? "rgb(200,200,200)": matrixcolor(sp, ze, spalten, zeilen), 
                  borderRadius:"100px"
                }}
                area={zellid}
              >
                <WortSteuerung
                  matrixwort={matrixwort}
                  updateWortmatrix={updateWortmatrix}
                  deleteMatrixwort={deleteMatrixwort({ix: ursprung.ix+sp, iy: ursprung.iy+ze})}
                  matrixNeu={matrixNeu(matrixwort)}
                  cursor={cursor}
                  setCursor={setCursor}
                />
              </Cell>
            );
          });
        })}
      </Grid>
    </div>
  );
}
export default WortMatrix;