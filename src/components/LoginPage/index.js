import React, { Component } from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class index extends Component {
  displayError = () => {
    const { auth } = this.props;
    if (auth.errors) {
      return (
        <ul className="w-50 mx-auto">
          {Object.entries(auth.errors).map((el) => (
            <li style={{ color: "red" }}>
              {el[0]}: {el[1]}
            </li>
          ))}
        </ul>
      );
    }
  };
  render() {
    const { auth } = this.props;
    if (auth.user && !auth.errors) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h1 className="my-5" style={{ fontSize: "80px" }}>
          Welcome
        </h1>
        {auth.errors && (
          <h6 className="mb-3" style={{ color: "red" }}>
            {this.displayError()}
          </h6>
        )}
        <div className="w-50 mx-auto">
          <LoginForm />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(index);
