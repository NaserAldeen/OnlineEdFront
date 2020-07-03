import React, { Component } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";
import { signup } from "../../store/actions/auth.js";

// Antd Components
import { Modal, Select, Input, Row, Col, message } from "antd";

// Actions

const { Option } = Select;

class NewBranchModal extends Component {
  state = {
    full_name: "",
    civil_id: "",
    username: "",
    password: "",
  };

  switchKeyError = (key) => {
    let temp = key;
    temp = temp.replace("username", "Username");

    return temp;
  };

  switchValueError = (key) => {
    let temp = key;
    if (Array.isArray(temp)) {
      temp = temp[0];
    }

    temp = temp;

    return temp;
  };
  displayError = () => {
    const { auth } = this.props;
    if (auth.errors) {
      return (
        <ul className="mx-auto">
          {Object.entries(auth.errors).map((el) => (
            <li style={{ color: "red", width: "100%" }}>
              {this.switchKeyError(el[0])}: {this.switchValueError(el[1])}
            </li>
          ))}
        </ul>
      );
    }
  };

  addItem = async () => {
    this.setState({ saveLoading: true });
    const s = this.state;
    try {
      const res = await instance.post(`/add_item/`, {
        ...s,
      });

      this.props.setItems(res.data.items);
      message.success("Item was added successfully");
    } catch (err) {
      console.error(err);
    }
    this.setState({ saveLoading: false });
  };

  handleSubmit = () => {
    const { username, password, full_name, civil_id } = this.state;

    let signupData = {
      username,
      password,
      full_name,
      civil_id,
      type: "worker",
    };

    this.props.signup(signupData);
  };

  saveButtonDisabled = () => {
    const s = this.state;
    return (
      s.full_name === "" ||
      s.civil_id === "" ||
      s.username == "" ||
      s.password == ""
    );
  };
  render() {
    const { visible, auth } = this.props;
    return (
      <Modal
        style={{ top: 20 }}
        destroyOnClose={true}
        title={
          <div
            className="ant-modal-title"
            style={{
              textAlign: "left",
            }}
          >
            New Item
          </div>
        }
        visible={visible}
        onCancel={() => this.props.onClose()}
        onOk={() => {
          this.handleSubmit();
          {
            /* this.props.onClose(); */
          }
        }}
        okText={"Add"}
        cancelText={"Close"}
        bodyStyle={{
          paddingTop: 0,
          width: "auto",
          padding: "0px 18px",
          textAlign: "left",
        }}
        okButtonProps={{
          disabled: this.saveButtonDisabled() == true,
          loading: this.state.saveLoading,
        }}
      >
        <div className="px-2 py-3 mb-3">
          {auth.errors && (
            <h6 className="mb-3" style={{ color: "red" }}>
              {this.displayError()}
            </h6>
          )}
          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">Civil ID</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input
                  placeholder={"Civil ID"}
                  style={{ float: "right" }}
                  onChange={(e) => this.setState({ civil_id: e.target.value })}
                />
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">{"Full name"}</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input
                  placeholder={"Full name"}
                  onChange={(e) => this.setState({ full_name: e.target.value })}
                  style={{ float: "right", direction: "ltr" }}
                />
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">{"Username"}</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input
                  placeholder={"Username"}
                  onChange={(e) => this.setState({ username: e.target.value })}
                  style={{ float: "right", direction: "ltr" }}
                />
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">{"Password"}</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input.Password
                  placeholder={"Password"}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  style={{ float: "right", direction: "ltr" }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    signup: (values) => dispatch(signup(values)),

    setItems: (items) => dispatch({ type: "SET_ITEMS", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
