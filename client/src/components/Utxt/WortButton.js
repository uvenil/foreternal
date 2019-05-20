import React from "react";
// import { Link } from "react-router-dom";

var buttonStyle = {
  // fontSize: 0,
  // heigth: "1em"
  // position: "relative",
  // color: 'white',
  // backgroundImage: 'url(' + imgUrl + ')',
  // WebkitTransition: 'all', // note the capital 'W' here
  // msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

class WortButton extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.satzListe
    };
  }

  render() {
    return (
      <tr>
        <td>

          <div style={buttonStyle}>
            <button 
              className="wortbutton"
              onClick={e => this.props.handleClick(this.props.wort._id)}
            >
              {this.props.wort.wort}
            </button>
          </div>
            {/*
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>frfwc </div>
                style={{ position: "absolute", top: 0, left: 0 }} 
              */}

        </td>
      </tr>
    )
  }
}

export default WortButton;
