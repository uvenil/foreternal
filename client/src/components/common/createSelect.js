// handleOptChange(null), Aufruf ohne event, gibt alle eingestellten Optionen zurück
// handleOptChange(event), Aufruf mit event, verstellt die Option
// optionen: verschachteltes Objekt mit den Optionen als Attribute (s.u.)
// opt: jeweilige Option als String, Bsp.: "typ"
  
import React from 'react';
import Textarea from 'react-textarea-autosize';

const optarr = (optionen, opt) => (
  [...Object.keys(optionen[opt])]
  .filter(o => (o!=="input" && o!=="label" && o!=="style"))
);

const createSelect = (optionen, handleOptChange) => opt => (
  <div key={opt}>
    {/* Selektion */}
    <label className="strong" htmlFor={opt}>
      {optionen[opt].label ? optionen[opt].label+" " : opt+" "}
    </label>
    { 
    optarr(optionen, opt).length===1?
    <div
      style={!optionen[opt].style ? {} : optionen[opt].style(handleOptChange(null)[opt][0])}  // style-Fkt. aus SatzEditOpt.js wird mit aktueller Option aufgerufen
    >
      {optarr(optionen, opt)[0]}
    </div>:
    <select
      name={opt +optionen.trenn+ "0"}  // Array und Index durch "optionen.trenn" getrennt
      onChange={handleOptChange}
      style={!optionen[opt].style ? {} : optionen[opt].style(handleOptChange(null)[opt][0])}
      value={handleOptChange(null)[opt][0]}
    >
      {optarr(optionen, opt)
        .map(o => (
          <option 
            key={o} 
            value={o}
            style={!optionen[opt].style ? {} : optionen[opt].style(o)}  // style-Fkt. aus SatzEditOpt.js wird mit aktueller Option aufgerufen
          >
            {o}
          </option>
      ))}
    </select>
    }
    { // Zahlen-Input
      !optionen[opt].input.z ? null :
      [...Array(optionen[opt].input.z).keys()].map(ix =>
        <input
          key={opt +optionen.trenn+ (ix+1)}  // Muster: "opt-ix", Bsp.: "laenge-0", "inhalt-1"
          name={opt +optionen.trenn+ (ix+1)}
          onChange={handleOptChange}
          style={{border:ix===0 ? "1px solid grey" : "none", width:"2rem"}}
          type="number"
          value={handleOptChange(null)[opt][ix+1]}
        />
      )
    }
    { // Text-Input
      !optionen[opt].input.t ? null :
      [...Array(optionen[opt].input.t).keys()].map(ix =>
        <Textarea
          key={opt +optionen.trenn+ (ix+1+optionen[opt].input.z)}
          name={opt +optionen.trenn+ (ix+1+optionen[opt].input.z)}
          onChange={handleOptChange}
          style={{border:ix===0 ? "1px solid grey" : "none", width:"6rem"}}
          type="text"
          value={handleOptChange(null)[opt][ix+1+optionen[opt].input.z]}
        />
      )
    }
  </div>
);

export default createSelect;

// als Objekt oder dynamisch mit Funktion erzeugen
//
// const optionen = {  
//   "opt1": new Set([
//     "wert1",
//     "wert2",
//     "input": {z:0, t:0}, // Anzahl Zahlen- und Anzahl Text-Inputs
//     "style",
//   ]),
//   "opt2": new Set([
//     "wert1",
//   ]),
// }
