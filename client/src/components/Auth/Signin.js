import React from "react";
import { withRouter, Link } from "react-router-dom";

import { Mutation } from "react-apollo";
import Error from "../Error";
import { SIGNIN_USER } from "../../queries";

const initialState = {
  username: "",
  password: ""
};

class Signin extends React.Component {
  state = { ...initialState };

  clearState = () => {
    if (this._isMount) this.setState({ ...initialState });
  };

  componentWillUnmount() {
    this._isMount = false;
  }

  componentDidMount() {
    this._isMount = true;
  }

  handleChange = event => {
    const { name, value } = event.target;
    if (this._isMount) this.setState({ [name]: value });
  };

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem("token", data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="App">
        <h2 className="App">Bitte anmelden</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signinUser)}
              >
                <input
                  autoFocus={true}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                >
                  Absenden
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
        <h4 >{"Falls noch nicht registriert, bitte zuerst "} 
          <button>
            <Link to={`/signup`}>
              {"registrieren"}
            </Link>
          </button> 
          .
        </h4>
      </div>
    );
  }
}

export default withRouter(Signin);
