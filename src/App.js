import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Component1 from "./components/Component1";
import LoginPage from "./components/LoginPage";
import { connect } from "react-redux";
import { Button } from "antd";
import { logout } from "./store/actions/auth.js";
class App extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="App">
        {user && <Button onClick={() => this.props.logout()}>Logout</Button>}

        {!user ? (
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Redirect from="/" to="/login" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/index" component={Component1} />
            <Redirect from="/" to="/index" />
          </Switch>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Move this to a navbar if you create one
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
