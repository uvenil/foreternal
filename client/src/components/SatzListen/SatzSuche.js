import React from "react";
import { SUCH_SATZE } from "../../queries";
import Zyklus from "./../Utxt/Zyklus";
import withQuery from "./../HOC/withQuery";

const Sucherg = ({data:{suchSatze}, handleClick, userdata}) => (
  !(suchSatze && suchSatze.length>0)? 
    <p>Es sind noch keine Sätze vorhanden. Bitte anlegen unter SatzEingabe oder TextEingabe. Vorher ggf. anmelden oder registrieren!</p>:
    <Zyklus 
      zyklus="tableedit"
      handleClick={handleClick} 
      satze={suchSatze}
      userdata={userdata}
    />
);

class SatzSuche extends React.Component {
  constructor(props) {
    super();
    let {suchBegr} = props.userdata;
    this.state = {
      suchBegr,
    };
  }

  componentWillUnmount() { 
    const {suchBegr} = this.state;
    this.props.userdata.set({suchBegr});
  }

  render() {
    // const { satzListe } = this.state;
    const { handleClick, userdata } = this.props;
    const {username} = userdata.user;
    const suchBegr = this.state.suchBegr || "";
    // console.log({ handleClick, userdata });
    // console.log("render satzListe", satzListe);
    const SuchergQ = withQuery(SUCH_SATZE, { suchBegr, username })(Sucherg);
    return (  // !!! hier: Form submission canceled because the form is not connected
      <div className="App">
        <h2 className="main-title">Satzsuche</h2>
        <form
          onSubmit={() => this.props.userdata.set({suchBegr})}
        >
          <input
            type="search"
            className="search"
            placeholder="Suchbegriff eingeben"
            onChange={event => this.setState({suchBegr:event.target.value})}
            value={suchBegr}
          />
          <button
            type="submit"
          >
            Suchbegriff speichern
          </button>
        </form>

        <SuchergQ
          handleClick={handleClick}
          userdata={userdata}
        />
      </div>
    );
  }
}

export default SatzSuche;
