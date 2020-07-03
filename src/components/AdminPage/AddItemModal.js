import React, { Component } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";

// Antd Components
import { Modal, Select, Input, Row, Col, message } from "antd";

// Actions

const { Option } = Select;

class NewBranchModal extends Component {
  state = {
    name: "",
    inventory: "",
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

  saveButtonDisabled = () => {
    const s = this.state;
    return s.name === "" || s.inventory === "";
  };
  render() {
    const { visible } = this.props;
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
          this.addItem();
          this.props.onClose();
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
        <div className="px-2 mb-3">
          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">Product name</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input
                  placeholder={"Product name"}
                  style={{ float: "right" }}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <p className="mr-3">{"Inventory"}</p>
              </Col>
              <Col xl={16} lg={16} md={16} sm={16} xs={24}>
                <Input
                  placeholder={"Inventory"}
                  onChange={(e) => this.setState({ inventory: e.target.value })}
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
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    setItems: (items) => dispatch({ type: "SET_ITEMS", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
