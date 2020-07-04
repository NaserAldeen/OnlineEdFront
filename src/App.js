import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import LoginPage from "./components/LoginPage";
import { connect } from "react-redux";
import { Button } from "antd";
import { logout } from "./store/actions/auth.js";
import Header from "./components/Layout/Header";
import StudentPage from "./components/StudentPage";
import TeacherPage from "./components/TeacherPage";

class App extends Component {
  getNextPageAfterLogin = (type) => {
    switch (type) {
      case "student":
        return "/student";
      case "teacher":
        return "/teacher";
    }
  };
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
            <Route path="/student" component={StudentPage} />
            <Route path="/teacher" component={TeacherPage} />
            <Redirect from="/" to={this.getNextPageAfterLogin(userType)} />
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
