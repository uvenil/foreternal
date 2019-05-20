// Linksklick faltet, Rechtsklick schließt eingeschlossene Komponente

import React from 'react';
import styled from 'styled-components';

// const Unfold = (props) => <div {...props}>Test2</div>;
// const Fold = fold(Unfold);  
// const CellFold = fold(() => Cell);  // funktioniert nicht!,  auch nicht: () => Cell  oder  () => <Cell/>
// Markup: <div>Test2</div>
// Komponente: {() => <div>Test2</div>}, 
// Komponente mit props: {(props) => <div {...props}>Test2</div>>},

// Pfeil
const Arrow = styled.button`
  background: inherit;
  border: none;
  color: lightgrey;
  cursor: pointer;
  display: inline-block;
  font: inherit;
  font-size: 1rem;
  margin: 0;
  outline: unset;
  padding: 0;
  text-decoration: none;
  type: button;
  z-index: 100;
  &:hover, &:active {
    color: blue;
  }
`;

// Container enthält Pfeil und Element
const Container = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  width: 100%;
`;

const getDisplayName = Component => {
  return Component.displayName || Component.name || 'Component';
};

// const initialState = {
//   open: true
// }

// aus: https://reactjs.org/docs/higher-order-components.html
const fold = (Component) => props => {

  class Fold extends React.Component {
  // open: 1. Wrapped Component, 2. Children,  closed: > summary >(90deg)
    constructor(props) {
      super(props);
      
      this.state = { open: true };
      if (Component)  this.displayName = `Fold(${getDisplayName(Component)})`;
    }
    
    componentDidMount = () => {
      props.closed && this.setState({ open: false }, ()=>{
        console.log("closed!!!");
      });
    }

    toggleOpen = () => {
      this.setState(({ open }) => ({ open: !open }))
    }

    close = (e) => {
      e.preventDefault();
      this.setState({open: null});
    }

    render() {
      const { open } = this.state;
      if (open===null)  return null;
      let { style, summary, space } = props || {};
      space = space || "0%";
      if (open) { // open
        return (
          <Container style={style}>
            <Arrow 
              style={{ transform: "rotate(90deg)", marginRight: space }} 
              onClick={this.toggleOpen}
              onContextMenu={this.close} 
            >
              >
            </Arrow>
            <div style={style}>
              {Component && <Component {...props}/>}
              {props.children}
            </div>
          </Container>
        );
      } else {  // closed
        return (
          <Container style={{ justifyContent: "flex-start", ...style}}>
            <Arrow 
              style={{ color: "blue", transform: "rotate(0deg)", marginRight: space }} 
              onClick={this.toggleOpen} 
              onContextMenu={this.close} 
            >
              {summary && <span>{summary}</span>}
              {" <"}
            </Arrow>
          </Container>
        );
      }
    }
  };
  return <Fold/>;  // faltbare Komponente
}

export default fold;  // HOC

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



// ! child von <div>child</div> überschreibt child von <Fold>child</Fold> (= default child, wenn div-child nicht vorhanden)
// vermutlich weil es innen ist
// childs werden standardmäßig mit dargestellt, auch wenn sie nicht explizit als props.children angegeben wurden

// props.children = Fold-child
// (props)-Component-children = Component-child || {props.children}
// ()-Component-children = Component-child || null


// !!! external control of folding
// localStorage


// const Div = fold(props => <div {...props}/>);  
// const Div = ({ summary, ...props }) => (
//   <div {...props} style={{ overflow: "hidden" }}>
//     <Fold {...props} summary={summary}>
//       {props.children}
//     </Fold>
//   </div>
// );
