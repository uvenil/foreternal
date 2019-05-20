import React from "react";
import { Query } from "react-apollo";

import { GET_ALL_SATZE } from "../../queries";
import Spinner from "./../Spinner";
import Error from "./../Error";


const withSatze = Component => props => (
  <Query query={GET_ALL_SATZE} >
    {({ data, loading, error, refetch }) => {
      if (loading) return <Spinner />;
      if (error) return <Error error={error} />;
      return <Component 
        {...props} 
        refetch={refetch} 
        satze={data.getAllSatze} 
      />;
    }}
  </Query>
);

export default withSatze;
