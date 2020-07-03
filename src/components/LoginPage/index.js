import React, { Component } from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Radio } from "antd";
class index extends Component {
  state = {
    userType: "customer",
  };

  switchKeyError = (key) => {
    let temp = key;
    const { userType } = this.state;
    if (userType == "customer") {
      temp = temp
        .replace("username", "Civil ID")
        .replace("password", "Password")
        .replace("non_field_errors", "Error")
        .replace("email", "Civil ID");
    }
    if (userType == "branch") {
      temp = temp
        .replace("username", "email")
        .replace("username", "email")
        .replace("non_field_errors", "Error");
    }

    if (userType == "worker") {
      temp = temp.replace("non_field_errors", "Error");
    }
    return temp;
  };

  switchValueError = (key) => {
    let temp = key;
    if (Array.isArray(temp)) {
      temp = temp[0];
    }
    const { userType } = this.state;
    if (userType == "customer" && temp) {
      temp = temp.replace("email", "civil ID").replace("username", "civil ID");
    }
    if (userType == "branch") {
      temp = temp.replace("username", "email").replace("username", "Email");
    }
    if (userType == "worker") {
      temp = temp.replace("email", "username");
    }
    return temp;
  };
  displayError = () => {
    const { auth } = this.props;
    if (auth.errors) {
      return (
        <ul className="w-50 mx-auto">
          {Object.entries(auth.errors).map((el) => (
            <li style={{ color: "red" }}>
              {this.switchKeyError(el[0])}: {this.switchValueError(el[1])}
            </li>
          ))}
        </ul>
      );
    }
  };
  render() {
    const { auth } = this.props;
    const { userType } = this.state;
    console.log(window.location.pathname);
    if (
      auth.user &&
      !auth.errors &&
      (!window.location.pathname.includes("moci") || auth.type == "moci")
    ) {
      return <Redirect to="/" />;
    }
    return (
      <div className="text-center">
        <h1 className="my-5" style={{ fontSize: "80px" }}>
          Welcome to Tamween
        </h1>
        {auth.errors && (
          <h6 className="mb-3" style={{ color: "red" }}>
            {this.displayError()}
          </h6>
        )}
        <div
          style={{
            textAlign: "center",
          }}
          className="mb-4"
        >
          <p>Login as</p>
          <Radio.Group
            defaultValue="customer"
            buttonStyle="solid"
            className="mb-3"
            value={userType}
            onChange={(e) => {
              this.setState({ userType: e.target.value });
            }}
          >
            <Radio.Button value="customer" className="radio-hover">
              Customer
            </Radio.Button>
            <Radio.Button value="branch" className="radio-hover">
              Branch
            </Radio.Button>
            <Radio.Button value="admin" className="radio-hover">
              Admin
            </Radio.Button>
            <Radio.Button value="worker" className="radio-hover">
              Worker
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="w-50 mx-auto">
          <LoginForm userType={userType} />
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
