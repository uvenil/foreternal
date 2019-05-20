import React from "react";
import WortMatrix from "./WortMatrix";
import {matrixwortUr} from "./matrixwort";

const WortSurf = ({userdata}) => {
  if (!userdata.satz) return null;
  return (
    !userdata.satz? null:
    <WortMatrix 
      wortMatrix={[[matrixwortUr(userdata.satz.wort)]]}
      userdata={userdata}
    />
  );
}

export default WortSurf;