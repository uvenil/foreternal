import React from "react";
import { Mutation } from "react-apollo";
import { 
  ADD_USER_WORTE, 
  GET_CURRENT_USER,
} from "../../queries";
// import {buttonupdate} from "./buttonupdate";

class SaveUserWortButton extends React.Component {

  handleSave = (event, addUserWorte, variables) => {  // variables: {username, worte, key}
    event.preventDefault();
    // const {userdata} = this.props;
    addUserWorte(variables).then(({ data: {addUserWorte: {worte}} }) => {
      // console.log("saetze", saetze);
      let changetext = variables.bAdd? "Zugefügte": "Entfernte"
      changetext += " Stopworte";
      console.log(changetext, worte);
      let unchanged = null;
      if (worte.filter(s => !!s).length===0) {
        unchanged = variables.worte;
      // gespeicherte saetze ausfiltern -> unsafed
      } else {
        unchanged = variables.worte.filter(wort => 
          !worte.some(wo => wo===wort))
        if (unchanged.length===0) unchanged = null;
      }
      if (unchanged && unchanged.length>0)  console.log({unchanged});
    }).catch(err =>{
      console.log("Fehler: ",err.message);
    });
  }

  validateForm = (worte) => {
    return worte && worte.length>0;
  }

  render() {
    let {
      bAdd=true,
      button=false, 
      disabled=false,
      key="stopworte", 
      user, 
      worte=[], 
    } = this.props;
    const {username} = user;
    const variables = {
      bAdd,
      key,
      username,
      worte,
    };
    return (
      <Mutation
        mutation={ADD_USER_WORTE}
        variables={variables}
        refetchQueries={() => console.log("refetchQueries") || [
          { query: GET_CURRENT_USER },
        ]}
        // update={(cache,  { data: { addUserWorte } }) => {
        //   console.log({addUserWorte})
        //   // const updateWorte = addUserWorte.filter(s => !!s);
        //   const {ROOT_QUERY} = cache.data.data;
        //   console.log({ROOT_QUERY});
        //   let querykey, variables;
        //   // GET_CURRENT_USER
        //   querykey = "addUserWorte";
        //   delete cache.data.data.ROOT_QUERY[querykey];
        // }}
      >
        {(addUserWorte, attrs) => {
          let valid = !disabled && this.validateForm(worte);
          return (
            button?
            // (<div>
              <button
                // className="button-primary button-add"
                disabled={!valid}
                onClick={event => this.handleSave(event, addUserWorte, variables)}
                style={!valid? {color: "grey", fontWeight:600}: 
                  bAdd? {color: "green", fontWeight:600}:
                  {color: "red", fontWeight:600}
                }
                type="button"
              >
                {/* {attrs.loading ? "speichert..." : "-"+" Speichern"} */}
                { bAdd?
                  attrs.loading ? "speichert..." : "+":
                  attrs.loading ? "löscht..." : "-"
                }
              </button>:
            // </div>):
            // (<div>
              <a
                onClick={event => this.handleSave(event, addUserWorte, variables)}
                style={{fontWeight:600}}
              >
                { bAdd?
                  attrs.loading ? "speichert..." : "-":
                  attrs.loading ? "löscht..." : "+"
                }
              </a>
            // </div>)
          );
        }}
      </Mutation>
    )
  }
}

export default SaveUserWortButton;