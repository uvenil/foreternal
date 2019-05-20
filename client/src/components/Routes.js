import React from "react";
import {
  // BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  // withRouter
} from "react-router-dom";

import withAuth from "./HOC/withAuth";
import Navbar from "./Navbar";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import RecipePage from "./Recipe/RecipePage";
import Profile from "./Profile/Profile";

import Start from "./Utxt/Start";
import SatzGitter from "./SatzGitter/SatzGitter";
import SatzUndWort from "./SatzUndWort/SatzUndWort";
import WortSurf from "./WortSurf/WortSurf";
import Hierarchie from "./Hierarchie/Hierarchie";
// import SatzListen from "./SatzListen/SatzListen";
import SatzSuche from "./SatzListen/SatzSuche";
import SatzAdd from "./CRUD/SatzAdd";
import TextInput from "./CRUD/TextInput";
import { CellFold, Grid } from "./CellFold";

const ProfileAuth = withAuth(Profile);
const SatzAddAuth = withAuth(SatzAdd);
const TextInputAuth = withAuth(TextInput);

const LoadData = ({loaddata}) => {  // wechselt zur Komponente AppVoll und lädt Satzdaten
  loaddata();
  return null;
};

const Erst = (Component, loaddata) => props => (  // Lädt erst eine Komponente leer
  !loaddata ? (<Component {...props} />) :  // kein prop loaddata, da Daten bereits geladen wurden
  (<LoadData loaddata={loaddata} { ...props } />
  )
);

const Routes = ({loaddata, session, refetch, ...props}) => (
  // Navbar position fixed, 1. row (2rem) bildet Platzhalter vorm Scrolling
  <Grid
    areas={[
      "header",
      "main",
      "footer"
    ]}
    columns={1}
    gap="2px"
    rows={"6rem 1fr minmax(3rem,auto)"}
    // style={{boxSizing: "border-box", overflowX:"scroll", width: "200%"}}
  >
    {    console.log("userdata", props.userdata) || loaddata? "Leer": "Voll"}
    <Navbar {...props} />
    <CellFold summary="Main" area="main">
      <Switch>
        <Route path="/start/:_id" render={() => <Start {...props} loaddata={loaddata} session={session} />} />
        <Route path="/start" exact render={() => <Start {...props} loaddata={loaddata} session={session} />} />
        <Route path="/hierarchie/:_id" render={() => Erst(Hierarchie, loaddata)(props)} />
        <Route path="/hierarchie" render={() => Erst(Hierarchie, loaddata)(props)} />}
        <Route path="/satzundwort/:_id" render={() => Erst(SatzUndWort, loaddata)(props)} />
        <Route path="/satzundwort" render={() => Erst(SatzUndWort, loaddata)(props)} />}
        {/* <Route path="/satzundwort" render={() => Erst(SatzListen, loaddata)(props)} />} */}
        <Route path="/satzgitter/:_id" render={() => Erst(SatzGitter, loaddata)(props)} />
        <Route path="/satzgitter" render={() => Erst(SatzGitter, loaddata)(props)} />
        <Route path="/wortsurf/:_id" render={() => Erst(WortSurf, loaddata)(props)} />
        <Route path="/wortsurf" render={() => Erst(WortSurf, loaddata)(props)} />}
        <Route path="/satze/suche" render={() => Erst(SatzSuche, loaddata)(props)} />
        {/* <Route path="/satze/suche" render={() => <SatzSuche {...props} loaddata={loaddata}/>} /> */}
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path="/satze/add" render={() => <SatzAddAuth session={session} userdata={props.userdata} />} />
        <Route path="/satze/textinput" render={() => <TextInputAuth {...props} />} />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route path="/profile" render={() => <ProfileAuth session={session} userdata={props.userdata} />} />
        <Route path="/:_id" exact render={() => <Start {...props} />} />
        <Redirect to="/start" />
      </Switch>
    </CellFold>
    <CellFold summary="Footer" area="footer">
    </CellFold>
  </Grid>
);

export default Routes;

/* // Abstand wird jetzt durch erste Grid-Reihe erzeugt
      <Route path="/" exact component={Start} />

      <CellFold summary="Navbar" area="header">
        <div style={{ display: "block", border: "5px solid black", backgroundColor: "white", padding: "100px 0 0 0", boxSizing: "border-box"}}></div>
      </CellFold>
*/
