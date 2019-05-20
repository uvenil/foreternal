import React from "react";
import { Query } from "react-apollo";
import Spinner from "./../Spinner";
import Error from "./../Error";

const withQuery = (QUERY, variables) => Component  => props => (
  <Query query={QUERY} variables={variables ? variables : null}>
    {({ data, loading, error, refetch }) => {
      if (loading) return <Spinner />;
      if (error) return <Error error={error} />;
      return <Component 
        {...props} 
        refetch={refetch} 
        data={data} 
      />;
    }}
  </Query>
);

export default withQuery;
