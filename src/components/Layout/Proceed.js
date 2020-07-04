import React, { Component } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";

// Antd Components
import {
  Modal,
  Select,
  Input,
  Row,
  Col,
  message,
  Button,
  Radio,
  DatePicker,
} from "antd";
import { List, Avatar } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

// Actions

const { Option } = Select;
const { RangePicker } = DatePicker;

class NewBranchModal extends Component {
  state = {
    selectedDeliveryType: "delivery",
    address: "",
    expected: "",
  };

  placeOrder = async () => {
    try {
      const res = await instance.post("/place_order/", {
        cart: JSON.stringify(this.props.cart),
        total: this.props.total,
        address: this.state.address,
        branch: this.props.selectedBranch || 1,
        is_delivery: this.state.selectedDeliveryType == "delivery",
        expected: this.state.expected || moment().format("YYYY-MM-DD HH:mm"),
      });
      //   this.props.setItems(res.data.items);
      message.success("Your order was placed successfully!");
      this.props.clearCart();
    } catch (err) {
      console.error(err);
      message.error("Couldn't place your order");
    }

    this.props.onClose();
  };

  render() {
    const { visible, cart } = this.props;
    const { selectedDeliveryType } = this.state;
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
            Select fulfilmment type
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
        width={"40%"}
        okButtonProps={{
          disabled:
            this.state.address === "" && selectedDeliveryType == "delivery",
        }}
        okText="Place order"
        onOk={() => this.placeOrder()}
      >
        <div className="px-3 pt-3 pb-3 mb-3 text-center">
          <h5 className="mb-3 mt-2">Select how you want to get this item</h5>
          <Radio.Group
            defaultValue="delivery"
            buttonStyle="solid"
            className="mb-3"
            onChange={(e) => {
              this.setState({ selectedDeliveryType: e.target.value });
            }}
          >
            <Radio.Button value="delivery" className="radio-hover">
              Delivery
            </Radio.Button>

            <Radio.Button value="Pickup" className="radio-hover">
              Pickup
            </Radio.Button>
          </Radio.Group>
          <div>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              defaultValue={moment()}
              onChange={(date, dateStr) => this.setState({ expected: dateStr })}
              showTime={{ format: "HH:mm" }}
            />
          </div>
          {selectedDeliveryType == "delivery" && (
            <div className="text-left">
              <p>Your address</p>
              <TextArea
                onChange={(e) => this.setState({ address: e.target.value })}
              />
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
    branch: state.admin.selectedBranch,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setWorkers: (items) => dispatch({ type: "SET_WORKERS", payload: items }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
