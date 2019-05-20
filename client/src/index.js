import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import App from "./components/App"
import withSession from "./components/HOC/withSession";
import { GraphQLClient, ClientContext } from 'graphql-hooks';


// Umgebungsvariablen NODE_ENV, API_URI einmal ausgeben
let API_URI = "";
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  API_URI = "http://localhost:4444/graphql"
} else if (process.env.NODE_ENV === "production") {
  API_URI = "https://utxt.herokuapp.com/graphql"
}

const once = ((str) => {
  let executed = false;
  return function (str) {
    if (!executed) {
      executed = true;
      console.log("\n- Client -", str);
    }
  };
})();
// const { cwd, pid, ppid, title, argv, execArgv, execPath } = process;
// once({ cwd, pid, ppid, title, argv, execArgv, execPath });
once(`
NODE_ENV: ${process.env.NODE_ENV}
API_URI: ${ API_URI }
`)

const hookclient = new GraphQLClient({
  url: API_URI
})

// Apollo Client
const client = new ApolloClient({
  uri: API_URI,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      localStorage.setItem("token", "");
    }
  }
});

const AppUser = withSession(App);

// App rendern
ReactDOM.render(
  <ApolloProvider client={client}>
    <ClientContext.Provider value={hookclient}>
      <Router>
        <AppUser/>
      </Router>
    </ClientContext.Provider>    
  </ApolloProvider>,
  document.getElementById("root")
);
