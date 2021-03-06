import React, { useState, useEffect, useRef, Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  Spin,
  Table,
  message,
  Select,
  Card,
  Tag,
} from "antd";
import instance from "../../store/actions/instance.js";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductModal from "./ProductModal.js";
import { Redirect } from "react-router-dom";
import OrderHistoryModal from "./OrderHistoryModal";
const { Search } = Input;
const { Column } = Table;
const { Option } = Select;
const { Meta } = Card;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const EditableContext = React.createContext();

class index extends Component {
  state = {
    search: "",
    items: [],
    loading: false,

    productOpen: false,
    selectedProduct: null,

    historyModalOpen: false,
  };

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_items/");
      this.props.setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
    this.setState({ loading: false });
  };

  componentDidMount = () => {
    this.fetchItems();
  };
  render() {
    const {
      loading,
      productOpen,
      selectedProduct,
      historyModalOpen,
    } = this.state;
    const { admin } = this.props;

    if (!admin.selectedBranch) {
      return <Redirect to="/consumer" />;
    }
    if (loading) {
      return (
        <div className="my-5 text-center">
          <Spin indicator={antIcon} />
        </div>
      );
    }

    const data = admin.items.map((item) => ({ key: item.id, obj: item }));
    return (
      <div className="px-3 py-3">
        {selectedProduct && (
          <ProductModal
            visible={productOpen}
            selectedProduct={selectedProduct}
            onClose={() =>
              this.setState({ productOpen: false, selectedProduct: null })
            }
          />
        )}
        {historyModalOpen && (
          <OrderHistoryModal
            visible={historyModalOpen}
            onClose={() => this.setState({ historyModalOpen: false })}
          />
        )}
        <div className="text-lef">
          <Button
            type="primary"
            onClick={() => this.setState({ historyModalOpen: true })}
          >
            Order history
          </Button>
        </div>
        <Row className="my-4">
          <Col span={6}>
            <h4>Our products</h4>
          </Col>
          <Col span={18}>
            <Search
              placeholder={"Search for an item"}
              enterButton
              onChange={(e) => this.setState({ search: e.target.value })}
            />
          </Col>{" "}
        </Row>
        <Row>
          {admin.items.map((item) => (
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    style={{ width: 240, height: 240 }}
                    src={item.image}
                    onClick={() =>
                      this.setState({
                        selectedProduct: item,
                        productOpen: true,
                      })
                    }
                  />
                }
              >
                <Meta
                  title={
                    <>
                      <span>{item.name} </span>{" "}
                      <span>{item.price.toFixed(3)} KD</span>
                    </>
                  }
                  description={
                    <>
                      {" "}
                      {item.inventory > 0 ? (
                        <Tag color="green">In stock</Tag>
                      ) : (
                        <Tag color="red">Out of stock</Tag>
                      )}
                      <p className="mt-2">Purchase limit: {item.limit} items</p>
                      <Button
                        type="primary"
                        className="w-100"
                        onClick={() => this.props.addToCart(item)}
                        disabled={item.inventory == 0}
                      >
                        Add to cart
                      </Button>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.admin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setItems: (items) => dispatch({ type: "SET_ITEMS", payload: items }),
    addToCart: (item) => dispatch({ type: "ADD_TO_CART", payload: item }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
