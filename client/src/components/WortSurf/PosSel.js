import React from "react";

const PosSel = ({neuwortPos, setNeuwortPos}) => (
  <form 
    style={{fontSize:"0.9rem"}}
  >
    <div>Position für das neue Wort bei <strong>belegter</strong> Position?</div>
    <div>
      <input
        checked={neuwortPos==="daneben"}
        id={"daneben"}
        name="neuwortPos"
        onChange={(event)=>setNeuwortPos(event.target.value)}
        type="radio"
        value="daneben"
      />              
      <label htmlFor={"daneben"}>
        <strong>daneben</strong> in neuer Spalte 
      </label>
    </div>
    <div>
      <input
        checked={neuwortPos==="rand"}
        id={"rand"}
        name="neuwortPos"
        onChange={(event)=>setNeuwortPos(event.target.value)}
        type="radio"
        value="rand"
      />              
      <label htmlFor={"rand"}>
        <strong>am Rand</strong> in neuer Spalte
      </label>
    </div>
    <div>
      <input
        checked={neuwortPos==="next"}
        id={"next"}
        name="neuwortPos"
        onChange={(event)=>setNeuwortPos(event.target.value)}
        type="radio"
        value="next"
      />              
      <label htmlFor={"next"}>
        <strong>nächstmögliche</strong> vorhandene Spalte
      </label>
    </div>
    <div>
      <input
        checked={neuwortPos==="ersetzen"}
        id={"ersetzen"}
        name="neuwortPos"
        onChange={(event)=>setNeuwortPos(event.target.value)}
        type="radio"
        value="ersetzen"
      />              
      <label htmlFor={"ersetzen"}>
        <strong>Wort überschreiben</strong> in gleicher Spalte
      </label>
    </div>
    {/* <div>
      <button type="button" onClick={()=>setNeuwortPos(false)}>Schließen</button> 
      <button type="button" disabled={typeof neuwortPos!=="string"} autoFocus={true} onClick={(e)=>
          console.log("cb") ||
          console.log({e}) 
        }
      >
        Ok
      </button>
    </div> */}
  </form>
);

export default PosSel;