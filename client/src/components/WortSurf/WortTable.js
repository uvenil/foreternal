import React from "react";
import {matrixwortStd} from "./matrixwort";

const WortTable = ({handleClick, vorkoord, wortListe}) => {
  return ( 
    // console.log({wortListe}) ||
    wortListe.sort((woa, wob)=>[woa.wort, wob.wort].sort()[0]===woa.wort? 1: -1).map((wort, ix) => (
        <a key={ix} onClick={()=>handleClick({...matrixwortStd, wort})}>
          {`${wort.wort} `}
        </a>
    ))
  );

}

export default WortTable;