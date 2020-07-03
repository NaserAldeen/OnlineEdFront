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
} from "antd";
import instance from "../../store/actions/instance.js";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Column } = Table;
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

    addModalOpen: false,
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
  render() {
    const { loading, addItemModal } = this.state;
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
