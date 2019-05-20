import React from "react";

import ZellSteuerung from "./ZellSteuerung";

class SatzZelle extends React.Component {

  constructor(props) {
    super(props);
    this.state = { zelleloaded: false };
  }

  componentDidMount() {
      const { satz } = this.props.data; // satz mit mehr Details (fragment satznested)
      this.setState({ satz }, () => {
        this.setState({ zelleloaded: true });  // loaded = Zeichen, dass man sich auf den state verlassen kann
      });
  }

  handleChange = event => {
    const { handleZelleChange, zelleState } = this.props;
    handleZelleChange(event, zelleState.zelleid, this.state.satz);
  };

  render() {
    // Variablen aus props und state zuweisen
    if (!this.state.zelleloaded) return null;  // Satze als Datengrundlage noch nicht geladen
    // console.log("SZ this.props", this.props);
    const { satz } = this.state;
    const { compnames, Component, handleClick, satztypen, userdata, zelleState } = this.props;
    // const { rtg, subtyp, tiefe } = zelleState;
    zelleState.tiefe = Number(zelleState.tiefe);
    if (!satz) {  // gesuchter Satz nicht vorhanden
      return <div>Keine Sätze ausgewählt!</div>;
    }
    return (  // benötigt für die ZellSteuerung this.props.children in der Komponente
      <div
      >
        <Component {...zelleState}
          handleChange={this.handleChange} 
          handleClick={handleClick}
          satz={satz}
          satztypen={satztypen}
          userdata={userdata}
        >
          <ZellSteuerung {...zelleState}
            compnames={compnames}
            handleChange={this.handleChange} 
          />
        </Component>
      </div>

    );
  }
};

export default SatzZelle;
