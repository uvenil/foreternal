import React from "react";
import { withRouter } from "react-router-dom";
import withCoreUrl from "./withCoreUrl";
import withSatzFromUrl from "./withSatzFromUrl";


const withSatzUrl = Component => ({ ...props }) => {
  if (!props.userdata.satze || props.userdata.satze.length===0) {
    return (
      <Component {...props} />
    );
  }
  let ComponentWith = withCoreUrl(withSatzFromUrl(Component));
  if (!props.history)   ComponentWith = withRouter(ComponentWith);  // withRouter nur wenn noch nicht vorher angewendet
  console.log("su props", props);
return (
    <ComponentWith {...props} />
  );
}

// const withSatzUrl2 = Component => ({ ...props }) => {
//   const ComponentWith = withCoreUrl(withSatzFromUrl(Component));
//   return (
//     <ComponentWith {...props} />
//   );
// }

// const withSatzUrl3 = Component => ({ location, match, ...props }) => {
//   const ComponentWith = withSatzFromUrl(Component);
//   return (
//     <ComponentWith {...props} match={match} location={location} coreurl={coreUrl(match, location)}/>
//   );
// }

// const coreUrl = (match, location) => {
//   // liefert prop coreurl, aus match.url oder location.pathname berechnet
//   let coreUrl = "";
//   if (match && match.params._id) {  // wenn params._id:  match.url - match.params._id
//     coreUrl = match.url.replace(match.params._id, "");
//   } else if (location && location.pathname) {// coreUrl in location suchen, wenn keine match.params._id vorhanden
//     let url = location.pathname;
//     if (url.endsWith("/"))  url = url.slice(0, -1);
//     let urlarr = url.split("/");
//     let param = urlarr[urlarr.length-1];  // Parameter am Ende der url
//     if (param.match(/[0-9]/g) && param.match(/[0-9]/g).length>1) {  // mehr als 1 Zahl am Ende der url spricht für _id
//       coreUrl = urlarr.slice(0,-1).join("/");
//     } else {  // anscheinend keine _id am Ende der url enthalten
//       coreUrl = url;
//     }
//   } else if (match.url) { // keine _id gefunden
//       console.log("coreUrl: Keine coreUrl bzw. _id gefunden in " + match.url + "! - Verwende match.url.");
//       coreUrl = match.url; // bei aktueller url bleiben, wenn keine satzId übergeben wurde
//   } else {  // keine match und keine location url => default null
//       console.log("coreUrl: Keine coreUrl gefunden!");
//       coreUrl = null; // bei aktueller url bleiben, wenn keine satzId übergeben wurde
//   }
//   if (!coreUrl.endsWith("/")) coreUrl += "/"; // ggf. / an das Ende der coreUrl
//   console.log("coreUrl: coreUrl", coreUrl);
//   return coreUrl;
// }

export default withSatzUrl;
