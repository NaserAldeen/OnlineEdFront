import React, { Component } from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Radio } from "antd";
class index extends Component {
  state = {
    userType: "student",
  };

  switchKeyError = (key) => {
    let temp = key;
    const { userType } = this.state;

    temp = temp
      .replace("non_field_errors", "Error")
      .replace("username", "Email");

    return temp;
  };

  switchValueError = (key) => {
    let temp = key;
    if (Array.isArray(temp)) {
      temp = temp[0];
    }
    const { userType } = this.state;
    temp = temp.replace("username", "email");

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

    return (
      <div className="text-center">
        <h1 className="my-5" style={{ fontSize: "80px" }}>
          Welcome to OnlineEd
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
            defaultValue="student"
            buttonStyle="solid"
            className="mb-3"
            value={userType}
            onChange={(e) => {
              this.setState({ userType: e.target.value });
            }}
          >
            <Radio.Button value="student" className="radio-hover">
              Student
            </Radio.Button>
            <Radio.Button value="teacher" className="radio-hover">
              Teacher
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
