import React from "react";
import { withRouter } from "react-router-dom";
import {sortedobj} from "../../util/wortber";
import { Mutation, Query } from "react-apollo";
import { 
  ADD_FULL_SATZ, 
  GET_USER_SATZE, 
  SUCH_SATZE,
} from "../../queries";

import Spinner from "../Spinner";
import Error from "../Error";

const initialState = {
  typ: "Liste",
  wort: "",
  worte: "",
  worteIf: ""
};

class SatzAdd extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, addFullSatz) => {
    event.preventDefault();
    let {
      typ,
      wort,
      worte,
      worteIf,
      username
    } = this.state;
    wort = wort ? wort : "unbenannt"; // default Wert für wort
    addFullSatz({
      variables: {
        "input": {
          typ,
          wort,
          worte,
          worteIf,
          username
        }
      }
    }).then(({ data }) => {
      console.log("data", data);
      this.clearState();
      this.props.history.push("/satze/add");
    }).catch(err =>{
      console.log("Fehler:",err);
    });
  };


  validateForm = () => {
    const { typ, worte } = this.state;  // wort, 
    const isInvalid = !typ || !worte; //!wort || 
    return isInvalid;
  };

  updateCache = (cache, { data: { addFullSatz }, username }) => {
    console.log("---cache", cache);
    
    const { getUserSatze } = cache.readQuery({ query: GET_USER_SATZE, variables: { username } });

    cache.writeQuery({
      query: GET_USER_SATZE,
      variables: { username },
      data: {
        getUserSatze: [addFullSatz, ...getUserSatze]
      }
    });
  };
// !!! hier: Satztypliste farbig!
  render() {
    const {
      typ,
      wort,
      worte,
      worteIf,
      username
    } = this.state;
    const {satztypen} = this.props.userdata.user;

    return (
      <Mutation
        mutation={ADD_FULL_SATZ}
        variables={{
          "input": {
            typ,
            wort,
            worte,
            worteIf,
            username
          }
        }}
        refetchQueries={() => [
          // { query: GET_ALL_SATZE },
          { query: SUCH_SATZE, variables: { suchBegr: "" } },
          { query: GET_USER_SATZE, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addFullSatz, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="main-title">Satz eingeben</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addFullSatz)}
              >
                <div>
                  <label htmlFor="worte">Satz </label>
                  <input
                    type="text"
                    name="worte"
                    placeholder="Satz hier eingeben"
                    onChange={this.handleChange}
                    value={worte}
                  />
                </div>
                <div>
                  <label htmlFor="wort">Satzüberschrift </label>
                  <input
                    type="text"
                    name="wort"
                    placeholder="Satzüberschrift eingeben"
                    onChange={this.handleChange}
                    value={wort}
                  />
                </div>
                <div>
                  <label htmlFor="typ">Satztyp </label>
                  <select // abgefragte Satztypen aus typedefs.js
                    name="typ"
                    onChange={this.handleChange}
                    style={{ color: satztypen[typ] }}
                    value={typ}
                  >
                    {Object.keys(sortedobj(satztypen)).map(typ => (<option key={typ} value={typ} style={{ color: satztypen[typ] }}>{typ}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="worteIf">Gültigkeitsbedingung </label>
                  <input
                    type="text"
                    name="worteIf"
                    placeholder="Worte als Voraussetzung für die Gültigkeit des Satzes"
                    onChange={this.handleChange}
                    value={worteIf}
                  />
                </div>
                <div>
                  <button
                    disabled={loading || this.validateForm()}
                    type="submit"
                    className="button-primary"
                  >
                    Speichern
                  </button>
                </div>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(SatzAdd);
