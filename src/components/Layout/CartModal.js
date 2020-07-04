import React, { Component } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";

// Antd Components
import { Modal, Select, Input, Row, Col, message, Button } from "antd";
import { List, Avatar } from "antd";
import Proceed from "./Proceed";

// Actions

const { Option } = Select;

class NewBranchModal extends Component {
  state = {
    proceedOpen: false,
  };

  render() {
    const { visible, cart } = this.props;
    const { proceedOpen } = this.state;
    const data = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      description: item.description,
    }));
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
            Your cart
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
        <Proceed
          visible={proceedOpen}
          onClose={() => this.setState({ proceedOpen: false })}
        />
        <div className="px-3 pt-3 pb-5 mb-3">
          <h3>Your items</h3>

          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={
                    <>
                      <span>{item.name}</span>
                      <span style={{ float: "right" }}>
                        {item.price.toFixed(3)} KD x {item.quantity} ={" "}
                        {(item.price * item.quantity).toFixed(3)} KD
                      </span>
                    </>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />

          {cart.length > 0 && (
            <div className="my-5">
              <span className="float-left" style={{ fontSize: 25 }}>
                Total: {this.props.total.toFixed(3)} KD
              </span>
              <span className="float-right">
                <Button
                  type="primary"
                  onClick={() => this.setState({ proceedOpen: true })}
                >
                  Proceed to checkout
                </Button>
              </span>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.admin.cart,
    total: state.admin.total,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setWorkers: (items) => dispatch({ type: "SET_WORKERS", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
