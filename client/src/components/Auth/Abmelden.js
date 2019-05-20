import React from "react";
import { withRouter } from "react-router-dom";

import { ApolloConsumer } from "react-apollo";

const handleAbmelden = (client, history) => {
  localStorage.setItem("token", "");
  client.resetStore();
  history.push("/");
};

const Abmelden = ({ history }) => (
  <ApolloConsumer>
    {client => {
      return (
        <button 
          onClick={() => handleAbmelden(client, history)}
        >
          <a>
            Abmelden
          </a>
        </button>
      );
    }}
  </ApolloConsumer>
);

export default withRouter(Abmelden);
