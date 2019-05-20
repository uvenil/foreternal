import React, { Fragment } from "react";
import { Link } from "react-router-dom";


const Sfc1 = ({ session }) => (
  <nav>
    {session && session.getCurrentUser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth />
    )}
  </nav>
);

export default Sfc1;


const Sfc2 = ({ match }) => {
  const { _id } = match.params;
  return (
    <div>
      Text
    </div>
  );
};

export default Sfc2;