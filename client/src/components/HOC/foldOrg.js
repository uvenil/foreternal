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
  outline: inherit;
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
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

// const Hover = styled.div`
//   &:hover ${Arrow} {
//     color: blue;
//   }
// `;


const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Component';
};

const initialState = {
  open: true
}

// aus: https://reactjs.org/docs/higher-order-components.html
const fold = (Component) => {

  class Fold extends React.Component {
  // open: 1. Wrapped Component, 2. Children,  closed: > summary >(90deg)
    constructor(props) {
      super(props);
      this.state = { ...initialState };
      if (Component)  this.displayName = `Fold(${getDisplayName(Component)})`;
    }
    
    componentDidMount = () => {
      this.setState({ ...initialState });
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
      let { style } = this.props || {};

      if (open) { // open
        style = { ...style, transform: "rotate(90deg)" };
        return (
          <Container>
            <Arrow 
              style={style} 
              onClick={this.toggleOpen}
              onContextMenu={this.close} 
              >
              >
            </Arrow>
            {Component && <Component {...this.props}/>}
            {this.props.children}
          </Container>
        );
      } else {  // closed
        style = { ...style, transform: "rotate(0deg)", color: "blue" };
        return (
          <Container>
            <Arrow 
              style={style}
              onClick={this.toggleOpen} 
              onContextMenu={this.close} 
              >
              >{this.props.summary && <span> {this.props.summary} <span style={{ transform: "rotate(90deg)", display: "inline-block"}}>></span></span>}
            </Arrow>
          </Container>
        );
      }
    }
  };
  return Fold;  // angereicherte Komponente
}

export default fold;  // HOC

// localStorage
