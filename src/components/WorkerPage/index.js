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
  Select,
  message,
} from "antd";
import instance from "../../store/actions/instance.js";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import OrderModal from "./OrderModal.js";
import moment from "moment";
import CustomerHistory from "./CustomerHistory";

const { Search } = Input;
const { Column } = Table;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  return (
    <EditableContext.Provider>
      <tr {...props} />
    </EditableContext.Provider>
  );
};

const EditableCell = ({
  editable,
  children,
  string,
  initialValue,
  record,
  handleSave,
  direction,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = (e) => {
    toggleEdit();
    handleSave(record.obj.id, e.target.value);
  };

  if (editable) {
    children = editing ? (
      string ? (
        <Input
          defaultValue={initialValue}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{ direction: direction ? direction : "ltr" }}
        />
      ) : (
        <InputNumber
          min={0}
          defaultValue={initialValue}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      )
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minHeight: 32,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{children}</td>;
};

class index extends Component {
  state = {
    search: "",
    items: [],
    loading: false,

    orderModalOpen: false,
    selectedOrder: null,

    historyModalOpen: false,
    selectedCustomer: null,
  };

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_items/");
      this.props.setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await instance.get("/fetch_orders/");
      this.props.setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
    this.setState({ loading: false });
  };

  delete = async (id) => {
    try {
      const res = await instance.post("/delete_item/", { id: id });
      this.props.setItems(res.data.items);
      message.success("Item deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  saveInventory = async (id, value) => {
    try {
      const res = await instance.post("/save_inventory/", {
        id: id,
        value: value,
      });
      this.props.setItems(res.data.items);
      message.success("Inventory changed successfully");
    } catch (err) {
      console.error(err);
    }
  };

  saveName = async (id, value) => {
    try {
      const res = await instance.post("/save_name/", {
        id: id,
        value: value,
      });
      this.props.setItems(res.data.items);
      message.success("Name changed successfully");
    } catch (err) {
      console.error(err);
    }
  };
  componentDidMount = () => {
    this.fetchItems();
  };

  changeOrderStatus = async (order, status) => {
    try {
      const res = await instance.post("/change_order_status/", {
        id: order,
        status: status,
      });
      try {
        const res = await instance.get("/fetch_orders/");
        this.props.setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      }
      message.success("Status changed successfully");
    } catch (err) {
      message.error("Couldn't change the status");
      console.error(err);
    }
  };
  render() {
    const {
      loading,
      addItemModal,
      orderModalOpen,
      selectedOrder,
      selectedCustomer,
      historyModalOpen,
    } = this.state;
    const { admin } = this.props;

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
        {selectedOrder && (
          <OrderModal
            visible={orderModalOpen}
            selectedOrder={selectedOrder}
            onClose={() =>
              this.setState({ selectedOrder: null, orderModalOpen: false })
            }
          />
        )}
        {historyModalOpen && (
          <CustomerHistory
            visible={historyModalOpen}
            customer={selectedCustomer}
            onClose={() =>
              this.setState({ historyModalOpen: false, selectedCustomer: null })
            }
          />
        )}
        <h4>Inventory</h4>

        <Row className="my-4">
          <Col span={6}></Col>
          <Col span={18}>
            <Search
              placeholder={"Search for an item"}
              enterButton
              onChange={(e) => this.setState({ search: e.target.value })}
            />
          </Col>{" "}
        </Row>

        <Table
          scroll={{ x: 600 }}
          dataSource={data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100", "250"],
          }}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          rowClassName={() => "editable-row"}
        >
          <Column
            title={"Product"}
            key="product"
            render={(text, record) => <div>{record.obj.name}</div>}
          />

          <Column
            title={"Inventory"}
            key="inventory"
            render={(text, record) => <div>{record.obj.inventory}</div>}
            onCell={(record) => {
              return {
                style: { textAlign: "center" },
                record,
                string: false,
                editable: true,
                handleSave: (id, newInventory) => {
                  if (
                    newInventory != record.obj.inventory &&
                    !Number.isNaN(newInventory) &&
                    newInventory !== "" &&
                    newInventory >= 0 &&
                    newInventory > record.obj.inventory
                  ) {
                    this.saveInventory(record.obj.id, newInventory);
                  }
                },
                initialValue: record.obj.inventory,
              };
            }}
            onHeaderCell={() => {
              return {
                style: { textAlign: "center" },
              };
            }}
          />
        </Table>

        <h4>Incoming orders</h4>
        <Table
          scroll={{ x: 600 }}
          dataSource={admin.orders.map((order) => ({
            key: order.id,
            obj: order,
          }))}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100", "250"],
          }}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          rowClassName={() => "editable-row"}
        >
          <Column
            title={"Status"}
            key="status"
            render={(text, record) => (
              <Select
                defaultValue={record.obj.status}
                onChange={() => {}}
                style={{ width: 150 }}
                onChange={(e) => this.changeOrderStatus(record.obj.id, e)}
              >
                <Option value="New">Created</Option>
                <Option value="Cancelled">Cancelled</Option>
                <Option value="Out for Delivery">Out for Delivery</Option>
                <Option value="Waiting Pickup">Waiting Pickup</Option>
                <Option value="Done">Done</Option>
              </Select>
            )}
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
            title={"Customer"}
            key="customer"
            render={(text, record) => (
              <div>
                <p className="mb-0">{record.obj.customer.full_name}</p>
                <p className="mb-0">{record.obj.customer.username}</p>
                <p className="mb-0">{record.obj.customer.phone}</p>
                <Button
                  type="link"
                  className="p-0"
                  onClick={() =>
                    this.setState({
                      historyModalOpen: true,
                      selectedCustomer: record.obj.customer.id,
                    })
                  }
                >
                  History
                </Button>
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
    setOrders: (orders) => dispatch({ type: "SET_ORDERS", payload: orders }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
