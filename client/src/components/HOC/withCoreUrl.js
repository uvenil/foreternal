import React from "react";


const coreUrl = (match, location) => {
  // liefert prop coreurl, aus match.url oder location.pathname berechnet
  let coreUrl = "";
  if (match && match.params._id) {  // wenn params._id:  match.url - match.params._id
    coreUrl = match.url.replace(match.params._id, "");
  } else if (location && location.pathname) {// coreUrl in location suchen, wenn keine match.params._id vorhanden
    let url = location.pathname;
    if (url.endsWith("/"))  url = url.slice(0, -1);
    let urlarr = url.split("/");
    let param = urlarr[urlarr.length-1];  // Parameter am Ende der url
    if (param.match(/[0-9]/g) && param.match(/[0-9]/g).length>1) {  // mehr als 1 Zahl am Ende der url spricht für _id
      coreUrl = urlarr.slice(0,-1).join("/");
    } else {  // anscheinend keine _id am Ende der url enthalten
      coreUrl = url;
    }
  } else if (match.url) { // keine _id gefunden
      console.log("coreUrl: Keine coreUrl bzw. _id gefunden in " + match.url + "! - Verwende match.url.");
      coreUrl = match.url; // bei aktueller url bleiben, wenn keine satzId übergeben wurde
  } else {  // keine match und keine location url => default null
      console.log("coreUrl: Keine coreUrl gefunden!");
      coreUrl = null; // bei aktueller url bleiben, wenn keine satzId übergeben wurde
  }
  if (!coreUrl.endsWith("/")) coreUrl += "/"; // ggf. / an das Ende der coreUrl
  // console.log("coreUrl: coreUrl", coreUrl);
  return coreUrl;
}

const withCoreUrl = Component => ({ match, location, ...props}) => (
  <Component {...props} match={match} location={location} coreurl={coreUrl(match, location)}/>
);

export default withCoreUrl;
