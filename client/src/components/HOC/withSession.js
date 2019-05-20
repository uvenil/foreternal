import React from "react";
import { Query } from "react-apollo";
import { GET_CURRENT_USER } from "../../queries";

const satzTypen = (user) => { // ersetzt bisheriges satztypen
    const satztypen = {};
    const {typen, typfarben} = user;
    if (typen && typen.length>0) {
      typen.forEach((typ, ix) => satztypen[typ.wort] = typfarben[ix])
    } else {
      satztypen["Satz"] = "brown";
    }
    // console.log({satztypen});
    return satztypen;
  };

const withSession = Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, refetch }) => {
      if (loading) return null;
      let user = (data && data.getCurrentUser) || {"username": "unbekannt"};
      const satztypen = satzTypen(user)
      user = {...user, satztypen };
      console.log("username", user.username);
      return <Component {...props} 
        refetch={refetch} 
        satztypen={satztypen} // doppelt mit userdata.user.satztypen
        session={data} 
        userdata={{...props.userdata, user}}  // noch doppelt mit session
      />;
    }}
  </Query>
);

export default withSession;
