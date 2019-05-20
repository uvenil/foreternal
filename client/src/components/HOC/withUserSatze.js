import React from "react";
import { Query } from "react-apollo";

import { 
  // GET_ALL_SATZE,
  GET_USER_SATZE, 
} from "../../queries";
import Spinner from "./../Spinner";
import Error from "./../Error";


const withUserSatze = Component => props => {
  // Cache
  const {username} = props.userdata.user;
  // const satzecache = localStorage.getItem(`${username}_satze`);  // username als key (unique)
  const satzecache = "";
  let satze;
  if (satzecache) {
    satze = JSON.parse(satzecache); // props.satze aus localStorage
    return <Component 
      {...props} 
      userdata={{...props.userdata, satze}} 
    />;
  // oder Query
  } else return (
    <Query query={GET_USER_SATZE} variables={{username}}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <Error error={error} />;
        satze = data.getUserSatze;
        console.log({satze});
        if (satze && satze.length===0) {
          satze = null
        }
        // console.log("data", data);
        return <Component 
          {...props} 
          userdata={{...props.userdata, satze}} 
        />;
      }}
    </Query> 
  );
};

export default withUserSatze;
