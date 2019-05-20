import React from "react";

const withSatzFromUrl = Component => ({ 
  coreurl, 
  getUserSatz, 
  history, 
  loaddata, 
  loaded, 
  location, 
  match, 
  userdata: {satz}, 
  userdata,
  ...props 
}) => {
  // Übereinstimmung von state.satz und url.satz._id sicherstellen
  // sehr spezifisch (props getUserSatz, coreUrl) für UserData.js und Kindelemente
  if (loaddata) loaddata(); // Routes in UserData.js umwandeln
  // if (!loaded) return null; // benötigt?
  // console.log("loaded!");
  console.log("match", match);
  console.log("location", location);
  console.log("userdata", userdata);
  console.log("satz", satz);
  
  const { _id } = match.params;
  console.log("_id", _id);
  // keine url._id => url wechseln
  if (!_id && satz) { // keine match.params._id => zur url mit der aktuellen satz._id wechseln => satz bestimmt url
    if (coreurl) {
      const satzurl = coreurl + satz._id;
      history.push(satzurl);  // <Redirect to={`/worte/surf/${satze[satzIx]._id}`} />
    } else {
      console.log("withSatzFromUrl: keine coreurl => kein history.push!");
    }
  // andere url._id (falscher Satz) => state.satz wechseln
  } else if (_id && (!satz || _id !== satz._id)) { // match.params._id stimmt nicht mit satz._id überein => state.satz anpassen => url bestimmt satz
    console.log("withSatzFromUrl: neue match.params._id", _id);
    // satz = getUserSatz(_id);  // id in url (match.params) soll immer mit aktuellem Satz übereinstimmen
    // userdata.set({satz});
  }
  // richtige url._id => nichts unternehmen (_id !== satz._id), da bereits der korrekte satz vorhanden ist
  // let newuserdata = {...userdata, satz:{...userdata.satz, ...satz}}
  return (
    // <Component {...props} userdata={newuserdata} />
    <Component {...props} userdata={userdata} />
  );
};

export default withSatzFromUrl;
