import React from "react";
import { withRouter, NavLink, Link } from "react-router-dom";


const Anmelden = ({ history }) => (
  // console.log({history}) ||
  <button 
    disabled={history.location.pathname==="/signin"}
    // onClick={() => history.push("/signin")}
  >
    <Link to={`/signin`}>
      Anmelden
    </Link>
  </button>
);

export default withRouter(Anmelden);
