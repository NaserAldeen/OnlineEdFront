import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import LoginPage from "./components/LoginPage";
import { connect } from "react-redux";
import { Button } from "antd";
import { logout } from "./store/actions/auth.js";
import Header from "./components/Layout/Header";
class App extends Component {
  render() {
    const { user } = this.props;
    const userType = localStorage.getItem("type");
    return (
      <div className="App">
        {user && <Header />}

        {!user ? (
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Redirect from="/" to="/login" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/admin" component={AdminPage} />
            <Route path="/consumer" component={null} />
            <Redirect
              from="/"
              to={userType == "admin" ? "/admin" : "/consumer"}
            />
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
