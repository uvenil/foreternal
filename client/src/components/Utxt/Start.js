import React from "react";
import {Redirect} from "react-router-dom";
import Satzestat from "./Satzestat";
import ErrorBoundary from "./../common/ErrorBoundary";
import WortMatrixEinfach from "./../WortSurf/WortMatrixEinfach";
import {arr2obj, obj2arr, fillmatrix} from "./../../util/arrutils";

const Start2 = ({handleClick, history, loaddata, userdata, userdata: {satze, user}}) => {
  if (loaddata)  loaddata();  // sofort laden, auskommentieren für Abfrage
  return (
  <div className="App" style={{ width: "100%", position: "inline-block" }}>
    {user.username==="unbekannt"? <Redirect to={`/signin`} />: (
      !(satze && satze.length>0)?
        !loaddata?  // console.log({loaddata}) ||
          <p>Für diesen Benutzer sind keine Satze vorhanden. Bitte über Satz- oder Texteingabe!</p>:
          <div>
            
            <p>Zur Nutzung dieser App benötigen Sie Daten.</p>
            <button
              onClick={loaddata}
              autoFocus={true}
            >
              Daten laden
            </button>
            <p>oder</p>
            <button
              onClick={()=>history.push(`/satze/textinput`)}
            >
              Daten eingeben -> Texteingabe
            </button>
          </div>
        :
        <div style={{width:"100%"}}>
          {/* { !uebObj || !uebObj["Freunde"]? null:
          <WortMatrixEinfach
            wortMatrix={fillmatrix(uebObj["Freunde"].nonstopworte)} // wortMatrix={[["a", "b"], ["c", "d"]]}
            // ur={{ix:0, iy:0}}
          />} */}
          <Satzestat
            handleClick={handleClick} 
            satze={userdata.satze}
            userdata={userdata}
          />
          
        </div>
      )
    }
  </div>
);}

const Start = props => (
  <ErrorBoundary>
    <Start2 {...props}/>
  </ErrorBoundary>
);

export default Start;
