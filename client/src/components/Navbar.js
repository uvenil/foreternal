import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import styled from 'styled-components';
// import "./../index.css";


import Abmelden from "../components/Auth/Abmelden";
import Anmelden from "../components/Auth/Anmelden";
import fold from "./HOC/fold";


const Fold = fold();

const Li = styled.li`
  padding: 0rem 0.5rem;
`;

const Ul = styled.ul`
  align-items: center;
  border: 1px solid black;
  display: flex;
  flex-direction: row
  flex-wrap: wrap;
  justify-content: space-evenly;
  list-style: none;
  margin: auto;
  padding: 0rem;
`;

const Nav = styled.nav`
  background-color: #efefef;
  box-shadow: -3px 3px 10px 0px rgba(168, 168, 168, 0.7);
  display: block;
  font-size: 1.5rem;
  font-weight: 100;
  left: 0px;
  margin: auto;
  padding-bottom: 0rem;
  padding-top: 0rem;
  position: fixed;
  text-align: center;
  top: 0px;
  vertical-align: center;
  width: 100%;
`;

// Warum hat NavbarAuth eine größere height?
const Navbar = ({ userdata, userdata: {satze, user} }) => (
  <Fold summary="Menü" space="0.5rem" style={{boxSizing:"border-box", position:"fixed", width: "100%", zIndex:"50"}}>
    <Nav>
      <Ul>
        <Li>
          <NavLink to="/start" activeClassName="selected">Start</NavLink>
        </Li>
        { // nur, wenn satze vorhanden sind
        !(satze && satze.length>0)? null: ( 
        <Fragment>
          <Li>
              <NavLink to="/hierarchie" activeClassName="selected">Hierarchie</NavLink>
          </Li>
          <Li>
              <NavLink to="/satzundwort" activeClassName="selected">Satz+Wort</NavLink>
          </Li>
          <Li>
            <NavLink to="/satzgitter" activeClassName="selected">Satzgitter</NavLink>
          </Li>
          <Li>
            <NavLink to="/wortsurf" activeClassName="selected">Wortsurfen</NavLink>
          </Li>
          <Li>
            <NavLink to="/satze/suche" activeClassName="selected">Satzsuche</NavLink>
          </Li>
        </Fragment>
        )}
        { // Benutzer
        user.username!=="unbekannt"? (
        <Fragment>
          <Li>
            <NavLink to="/satze/add" activeClassName="selected">Satzeingabe</NavLink>
          </Li>
          <Li>
            <NavLink to="/satze/textinput" activeClassName="selected">Texteingabe</NavLink>
          </Li>
          <Li>
            <NavLink to="/profile" activeClassName="selected">Profil</NavLink>
          </Li>
          <Li>
            <Abmelden />
          </Li>
        </Fragment>
        ) : ( // kein Benutzer
        <Fragment>
          <Li>
            <NavLink to="/signup" activeClassName="selected">Registrieren</NavLink>
          </Li>
          <Li>
            <Anmelden />
          </Li>
        </Fragment>
        )}
      </Ul>
      { user.username!=="unbekannt" ? (
        <h4 style={{margin: 0}}>
          Willkommen, <strong>{user.username}</strong>
        </h4>
      ) : null}
    </Nav>
  </Fold>
);

export default Navbar;

// {
//   (() => {
//   })()
// }
