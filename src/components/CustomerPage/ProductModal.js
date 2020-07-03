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

  render() {
    const { visible, selectedProduct } = this.props;
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
            {selectedProduct.name}
          </div>
        }
        visible={visible}
        onCancel={() => this.props.onClose()}
        cancelText={"Close"}
        bodyStyle={{
          paddingTop: 0,
          width: "auto",
          padding: "0px 18px",
          textAlign: "left",
        }}
        width={"80%"}
        okButtonProps={{
          style: { display: "none" },
        }}
      >
        <div className="px-3 py-3 mb-3">
          <Row>
            <Col span={8}>
              <img src={selectedProduct.image} style={{ width: 200 }} />
            </Col>
            <Col span={16}>
              <h3 className="mb-0">{selectedProduct.name}</h3>
              <p className="text-muted">
                {selectedProduct.price.toFixed(3)} KD
              </p>
              <p className="mb-2">Description:</p>
              <p className="text-muted  ml-2">{selectedProduct.description}</p>

              <p>Purchase limit: {selectedProduct.limit} items</p>
            </Col>
          </Row>
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

    setWorkers: (items) => dispatch({ type: "SET_WORKERS", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
