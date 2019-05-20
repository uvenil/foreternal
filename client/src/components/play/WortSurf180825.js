import React, {Fragment} from "react";
// import "./../App.css";
import "./../font/flaticon.css";
import SatzSaeule from "./SatzSaeule";
import SatzKurzListe from "./SatzKurzListe"
import Obj from "./Obj";
import withQuery from "./../HOC/withQuery";
import { GET_ALL_SATZE } from "../../queries";
import { Grid, Cell } from "styled-css-grid";
// let pfeil = `${API_URI}/svg/003-up-arrow.svg`


class SatzUndWort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      satze: []
    }
  }

  componentDidMount() {
    if (this.props.data.getAllSatze) {
      this.setState({
        satze: this.props.data.getAllSatze
      });
    }
  }

  handleClick = (id) => {
    console.log("test", id);
  }

  render() {
    // const satz = this.props.userdata.satzListe[0];
    // if (!this.props.data) return <div>loading ...</div>
    let { satze } = this.state;
    if (satze.length===0) return null;
    console.log("satze",satze);
    return (
      <Grid 
        columns={2} 
        gap="2px"
        areas={[
          "icon titel",
          "sidebar main"
        ]}>
        <Cell area="icon">
          <div style={{
            padding: 5, margin: 5, border: "5px solid red", backgroundColor: "lightgrey"
            }}>
            {(() => {
              console.log("API_URI", this.props.API_URI);   // API_URI als prop, sh. https://expressjs.com/en/starter/static-files.html
            })()}
            <img href={`${this.props.API_URI}/svg/003-up-arrow.svg`} />>
            <div className="flaticon-left-arrow" style={{ padding: 0, margin: 0, border: "2px solid black", color: "green", backgroundColor: "cyan"}}>A</div>
            <span className="flaticon-right-arrow" style={{ padding: 0, margin: 0, border: "2px solid yellow", color: "blue", backgroundColor: "grey" }}>B</span>
            <b className="flaticon-up-arrow"></b>
            <span className="flaticon-down-arrow"></span>
          </div>
        </Cell>
        <Cell area="titel">
          <h1 className="main-title">
          Wortsurfen
          </h1>
          {
            (() => {
              console.log("IIFE");
              return <h6>IIFE</h6>
            })()  // IIFE = Immediately-Invoked Function Expression, https://engineering.musefind.com/our-best-practices-for-writing-react-components-dec3eb5c3fc8
          }
        </Cell>
        <Cell area="sidebar">
          <button
            onClick={e => console.log("clicked!")}
          >
          Testbutton
          </button>
        </Cell>
        <Cell area="main">
          <SatzKurzListe handleClick={this.handleClick} satzListe={satze}/>

        </Cell>

        {/*
         <div>{JSON.stringify(satze[0])}</div>
        <SatzSaeule satzListe={[satze[0]]} />
       <div>----------------------------------------------------</div>
        <Obj obj={satze[0]}></Obj>}
          <div>{satze.map(satz => satz.wort.wort)}</div>
             <WortTabelle satzListe={data.getAllSatze}/>
        */}


      </Grid>
    );
  }
}

export default withQuery(GET_ALL_SATZE)(SatzUndWort);
