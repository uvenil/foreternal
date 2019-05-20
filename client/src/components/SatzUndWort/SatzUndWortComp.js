import React from "react";
// import { withRouter } from "react-router-dom";

import withQuery from "./../HOC/withQuery";
import { GET_WORT_NESTED, GET_SATZ_NESTED } from "../../queries";
import { CellFold, Grid } from "./../CellFold";
import WortDetails from "./WortDetails";
import SatzDetails from "./SatzDetails";

const SatzUndWort = ({ 
  children, 
  satz, 
  wort, 
  ...props 
}) => {
  return (
    <Grid 
      columns={1}
      rows={"1fr auto 1fr"}
      gap="2px"
      style={{ margin: "auto", position:"relative" }}
      areas={[
        "wort",
        "satz"
      ]}>
      {
        (() => {
          // console.log("satz", satz);
        })()
      }
      {children   // this.props.children für die ZellSteuerung
      }
      <CellFold center middle summary="Wort" area="wort">
      {
        (() => {
          if (!wort || !wort._id) return null;
          const WortQ = withQuery(GET_WORT_NESTED, {_id: wort._id })(WortDetails);
          return (<WortQ {...props}/>);
          })()
        }
      </CellFold>
      <CellFold center middle summary="Satz" area="satz">
        {
          (() => {
            if (!satz || !satz._id) return null;
            const SatzQ = withQuery(GET_SATZ_NESTED, { _id: satz._id })(SatzDetails);
            return (<SatzQ {...props}/>);
          })()
        }
      </CellFold>
    </Grid>
  );
}

export default SatzUndWort;
