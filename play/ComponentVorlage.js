import React from "react";
import "./../App.css";

var style = {
  position: "absolute", 
  top: 0, 
  left: 0,
  color: 'white',
  backgroundImage: 'url(' + imgUrl + ')',
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

class SatzSaeule extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.satzListe
    };
  }

  handleClick() {
    console.log("test");

  }

  render() {

    return (
      <div className="satzsaeule" style={style}>
        <button style={{ position: "absolute", top: 0, left: 0 }} onClick={this.handleClick}>Wort</button>
        <div style={{ position: "absolute", top: 0, left: 0 }}>frfwc </div>
      </div>

    )
  }
}

export default SatzSaeule;
