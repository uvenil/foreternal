import React from "react";
import withQuery from "./../HOC/withQuery";
import { GET_WORT_NESTED, GET_SATZ_NESTED } from "../../queries";
import { CellFold, Grid } from "./../CellFold";
import WortDetails from "./WortDetails";
import SatzDetails from "./SatzDetails";

const SatzUndWort = ({ userdata: {wort, satz}, userdata, ...props }) => {
  return (
    <Grid 
      columns={1}
      rows={"1fr auto"}
      gap="2px"
      style={{ margin: "auto" }}
      areas={[
        "wort",
        "satz"
      ]}>
      {
        (() => {
          // console.log("satz", satz);
        })()
      }
      <CellFold center middle summary="Wort" area="wort">
      {
        (() => {
          if (!wort || !wort._id) return null;
          const WortQ = withQuery(GET_WORT_NESTED, {_id: wort._id })(WortDetails);
          return (<WortQ {...props} userdata={userdata}/>);
          })()
        }
      </CellFold>
      <CellFold center middle summary="Satz" area="satz">
        {
          (() => {
            if (!satz || !satz._id) return null;
            const SatzQ = withQuery(GET_SATZ_NESTED, { _id: satz._id })(SatzDetails);
            return (<SatzQ {...props} userdata={userdata}/>);
          })()
        }
      </CellFold>
    </Grid>
  );
}

export default SatzUndWort;
