import { Input, Button, Row, Col, Radio } from "antd";
import React from "react";
import { connect } from "react-redux";
import { login, signup } from "../../store/actions/auth.js";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

class LoginForm extends React.Component {
  state = {
    type: "signup",

    username: "",
    email: "",
    password: "",
  };
  handleSubmit = () => {
    const { username, email, password } = this.state;
    if (this.state.type == "login") {
      this.props.login({ username, password });
    } else {
      this.props.signup({ username, email, password });
    }
  };

  onChangeField = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { type } = this.state;
    return (
      <div>
        <Row gutter={[24, 24]} style={{ alignItems: "center" }}>
          <Col span={8} className="text-left">
            Username
          </Col>
          <Col span={16}>
            <Input
              size="large"
              placeholder="Username"
              prefix={<UserOutlined />}
              onChange={this.onChangeField}
              name="username"
            />
          </Col>

          {type == "signup" && (
            <>
              <Col span={8} className="text-left">
                Email
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Email"
                  prefix={<MailOutlined />}
                  onChange={this.onChangeField}
                  name="email"
                />
              </Col>
            </>
          )}
          <Col span={8} className="text-left">
            Password
          </Col>
          <Col span={16}>
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              onChange={this.onChangeField}
              name="password"
            />
          </Col>
        </Row>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
