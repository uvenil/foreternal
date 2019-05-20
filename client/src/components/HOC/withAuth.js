import React from "react";
// import "./../App.css";

import { Query } from "react-apollo";
// import { Redirect } from "react-router-dom";
import { GET_CURRENT_USER } from "../../queries";

const withAuth = conditionFunc => Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading }) => {
      if (loading) return null;
      return conditionFunc(data) ? (
        <Component {...props} />
      ) : (
          <div className="App">
          <p>
            Bitte anmelden oder registrieren!
            {/* <Redirect to="/" /> */}
          </p>
        </div>
      );
    }}
  </Query>
);

// Bedingungsparameter (session...) kann ggf verändert werden
export default withAuth(session => session && session.getCurrentUser); 
