import React from "react";
import { withRouter, Link } from "react-router-dom";

import { Mutation } from "react-apollo";
import Error from "../Error";
import { SIGNUP_USER } from "../../queries";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
};

class Signup extends React.Component {
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
    this.setState({ [name]: value });
  };

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({ data }) => {
      // console.log(data);
      localStorage.setItem("token", data.signupUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    const isInvalid =
      !username || !email || !password || password !== passwordConfirmation;
    return isInvalid;
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;

    return (
      <div className="App">
        <h2 className="App">Registrieren</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password }}
        >
          {(signupUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signupUser)}
              >
                <input
                  type="text"
                  name="username"
                  autoFocus={true}
                  placeholder="Benutzername"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Passwortbestätigung"
                  value={passwordConfirmation}
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

        <h4 >{"Falls bereits registriert, bitte "} 
          <button>
            <Link to={`/signup`}>
              {"anmelden"}
            </Link>
          </button> 
          .
        </h4>
      </div>
    );
  }
}

export default withRouter(Signup);
