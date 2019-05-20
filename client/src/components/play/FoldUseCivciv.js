import React from "react";
import styled from 'styled-components';

import fold from "./../HOC/fold";
import foldp from "./../HOC/foldp";
import Spinner from "../Spinner";
import Error from "../Error";



// sollte zum Testen auskommentiert werden
// Usage: // (sh. auch play/FoldUse)
// import fold from "./fold";
// const Fold = fold(() => <C style={{}}>child1</C>); // (ohne props!, da sonst das Fold-child2 doppelt erscheint, 1. Mal durch C gestylt)
// const Fold = fold(); // einfache Alternative

// Definition:
// const CFold = () => {
//   <Fold summary="sum" style={{}}>
//     child2
//   </Fold>
// };

// Ergebnis:
// <Container style={style}>
//   <Arrow/>
//   <C>child1</C>
//   child2
// </Container>
// sollte zum Testen auskommentiert werden



const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

// ! child von <div>child</div> überschreibt child von <Fold>child</Fold> (= default child, wenn div-child nicht vorhanden)
// vermutlich weil es innen ist
// childs werden standardmäßig mit dargestellt, auch wenn sie nicht explizit als props.children angegeben wurden

// props.children = Fold-child
// (props)-Component-children = Component-child || {props.children}
// ()-Component-children = Component-child || null
// const Fold = foldp();  // einfache Alternative
const Fold = foldp(() => <Container style={{color:"green"}}>child1</Container>);

const Civ = () => (<div>CivInhalt</div>); // nur dieser Inhalt ersetzt das child in der Verwendung
const civ = () => (<div>civInhalt</div>); // dieser Inhalt wird nicht angezeigt, da er vom child in der Verwendung ersetzt wird

const F1 = () => (
  <div>
  Rand1
  <civ>civChild</civ>
  Rand3  
  <Fold summary="sum" style={{color:"red"}}>
  child2
  </Fold>
  Rand5
  <Civ>civChild</Civ>
  Rand7 
  </div>
);

export default F1;
