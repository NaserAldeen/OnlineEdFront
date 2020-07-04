import { Input, Button, Row, Col, Radio } from "antd";
import React from "react";
import { connect } from "react-redux";
import { login, signup } from "../../store/actions/auth.js";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

class LoginForm extends React.Component {
  state = {
    type: "login",

    name: "",
    username: "",
    password: "",

    //Customer
  };
  handleSubmit = () => {
    const { username, password, name } = this.state;
    if (this.state.type == "login") {
      this.props.login({ username, password, type: this.props.userType });
    } else {
      let errors = {};
      if (!username) {
        errors["Username"] = "This field may not be empty";
      }
      if (!password) {
        errors["password"] = "This field may not be empty";
      }
      if (!name) {
        errors["Name"] = "This field may not be empty";
      }

      if (Object.keys(errors).length) {
        this.props.setError(errors);
        return;
      }
      const signupData = {
        username,
        password,
        name,
        type: this.props.userType,
      };

      this.props.signup(signupData);
    }
  };

  onChangeField = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let { type } = this.state;
    const { userType } = this.props;
    if (userType == "admin") {
      type = "login";
    }
    return (
      <div>
        <Row gutter={[24, 24]} style={{ alignItems: "center" }}>
          {type == "login" && (
            <>
              <Col span={8} className="text-left">
                Email *
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Username"
                  onChange={this.onChangeField}
                  name="username"
                />
              </Col>

              <Col span={8} className="text-left">
                Password *
              </Col>
              <Col span={16}>
                <Input.Password
                  size="large"
                  placeholder="Passowrd"
                  onChange={this.onChangeField}
                  name="password"
                />
              </Col>
            </>
          )}

          {type == "signup" && (
            <>
              <Col span={8} className="text-left">
                Name *
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Name"
                  onChange={this.onChangeField}
                  name="name"
                />
              </Col>

              <Col span={8} className="text-left">
                Email *
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Email"
                  onChange={this.onChangeField}
                  name="username"
                />
              </Col>

              <Col span={8} className="text-left">
                Password *
              </Col>
              <Col span={16}>
                <Input.Password
                  size="large"
                  placeholder="Password"
                  onChange={this.onChangeField}
                  name="password"
                />
              </Col>
            </>
          )}
        </Row>
        {userType != "admin" && userType != "worker" && (
          <div className="text-left">
            {type == "signup" ? "Already have an account?" : "New here?"}
            <Button
              type="link"
              onClick={() =>
                this.setState({ type: type == "login" ? "signup" : "login" })
              }
            >
              {type == "signup" ? "Login" : "Sign up"}
            </Button>
          </div>
        )}
        <div className="mt-3">
          <Button
            type="primary"
            size="large"
            className="w-100"
            onClick={this.handleSubmit}
          >
            {type == "signup" ? "Sign up" : "Login"}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Syntax
    login: (values) => dispatch(login(values)),
    signup: (values) => dispatch(signup(values)),
    setError: (payload) => dispatch({ type: "SET_ERROR", payload: payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
