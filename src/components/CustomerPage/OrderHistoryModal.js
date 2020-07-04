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
  Spin,
  Table,
} from "antd";
import { List, Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import OrderModal from "../WorkerPage/OrderModal";
// Actions

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Column } = Table;
const { Option } = Select;

class NewBranchModal extends Component {
  state = {
    orders: [],
    loading: false,

    orderModalOpen: false,
    selectedOrder: null,
  };

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_history/");
      console.log(res.data.orders);
      this.setState({ orders: res.data.orders });
    } catch (err) {
      console.error(err);
    }

    this.setState({ loading: false });
  };

  componentDidMount = () => {
    this.fetchItems();
  };
  render() {
    const { visible, cart } = this.props;
    const { orders, loading, selectedOrder, orderModalOpen } = this.state;
    // const data = JSON.parse(selectedOrder.items).map((item) => ({
    //   name: item.name,
    //   quantity: item.quantity,
    //   price: item.price,
    //   image: item.image,
    //   description: item.description,
    // }));
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
            Order history
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
        <div className="px-3 pt-4 pb-2 mb-3">
          {selectedOrder && (
            <OrderModal
              visible={orderModalOpen}
              selectedOrder={selectedOrder}
              onClose={() =>
                this.setState({ selectedOrder: null, orderModalOpen: false })
              }
            />
          )}
          <h5 className="mb-3">Your past orders</h5>
          {!loading ? (
            <Table
              scroll={{ x: 600 }}
              dataSource={orders.map((order) => ({
                key: order.id,
                obj: order,
              }))}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "25", "50", "100", "250"],
              }}
            >
              <Column
                title={"Status"}
                key="status"
                render={(text, record) => <div>{record.obj.status}</div>}
              />
              <Column
                title={"Placed"}
                key="placed"
                render={(text, record) => (
                  <div>
                    {moment(record.obj.created, "YYYY-MM-DDTHH:mm").format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </div>
                )}
              />
              <Column
                title={"Expected"}
                key="expected"
                render={(text, record) => (
                  <div
                    onClick={() =>
                      this.setState({
                        orderModalOpen: true,
                        selectedOrder: record.obj,
                      })
                    }
                  >
                    {record.obj.expected}
                  </div>
                )}
              />

              <Column
                title={"Type"}
                key="type"
                render={(text, record) => (
                  <div>
                    {record.obj.is_delivery
                      ? `Delivery to ${record.obj.address}`
                      : `Pickup`}
                  </div>
                )}
              />
            </Table>
          ) : (
            <div className="my-5 text-center">
              <Spin indicator={antIcon} />
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
