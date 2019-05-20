import React from "react";
import { Mutation } from "react-apollo";
import { 
  DELETE_SATZE,
  GET_USER_SATZE, 
  SUCH_SATZE,
  GET_CURRENT_USER,
} from "../../queries";
import {buttonupdate} from "./buttonupdate";

class DeleteButton extends React.Component {

  handleDelete = (event, deleteSatze, ids) => {
    event.preventDefault();
    const {userdata} = this.props;
    console.log({userdata});
    const confirmDelete = window.confirm(
      `Wollen Sie ${(ids && ids.length>1)? `die ausgewählten ${ids.length} Sätze`: `den Satz`} wirklich löschen?`
    );
    if (!confirmDelete) return;
    deleteSatze({
      variables: { ids }
    }).then(({ data }) => {
      console.log("deleted", data);
      userdata.set({satzeEdit: null});
    }).catch(err =>{
      console.log("Fehler:",err);
    });
  };

  validateForm = (ids) => {
    return (ids && ids.length>0);
  }

  render() {
    const {button=true, disabled, ids, userdata} = this.props;
    const {suchBegr, user: {username}} = userdata;
    return (
      <Mutation
        mutation={DELETE_SATZE}
        variables={{
          "ids": ids
        }}
        refetchQueries={() => [
          { query: GET_USER_SATZE, variables: { username }  },
          { query: SUCH_SATZE, variables: { suchBegr, username } },
          { query: GET_CURRENT_USER },
        ]}
        update={(cache, { data: { deleteSatze } }) => {
          const deleteIds = deleteSatze.filter(s => !!s).map(s => s._id);
          buttonupdate({
            cache, 
            updateSatze: [], 
            deleteIds, 
            suchBegr, 
            username, 
            GET_USER_SATZE, 
            SUCH_SATZE, 
            GET_CURRENT_USER
          });
        }}
      >
        {(deleteSatze, attrs) => {
          // console.log({ids});
          let valid = !disabled && this.validateForm(ids);
          return (
            button?
            (<div>
              <button
                // className="button-primary button-del"
                disabled={!valid}
                onClick={event => this.handleDelete(event, deleteSatze, ids)}
                style={!valid? {fontWeight:600}: {color: "red", fontWeight:600}}
                type="button"
              >
                {attrs.loading ? "löscht..." : "x Löschen"}
              </button>
            </div>):
            (<div>
              <a
                onClick={event => this.handleDelete(event, deleteSatze, ids)}
                style={!valid? {fontWeight:600}: {color: "red", fontWeight:600}}
              >
                {attrs.loading ? "löscht..." : "x"}
              </a>
            </div>)
          );
        }}
      </Mutation>
    )
  }
}


export default DeleteButton;