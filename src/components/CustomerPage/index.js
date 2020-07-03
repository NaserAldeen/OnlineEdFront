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
} from "antd";
import instance from "../../store/actions/instance.js";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";

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

    addModalOpen: false,

    selectedBranch: null,
  };

  fetchBranches = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_branches/");
      this.props.setBranches(res.data.branches);
    } catch (err) {
      console.error(err);
    }
    this.setState({ loading: false });
  };

  delete = async (id) => {
    try {
      const res = await instance.post("/delete_item/", { id: id });
      this.props.setBranches(res.data.items);
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
    this.fetchBranches();
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

    const data = admin.branches.map((item) => ({ key: item.id, obj: item }));
    return (
      <div className="px-3 py-3 text-center">
        <h2 style={{ marginTop: 165, marginBottom: 45 }}>
          Please select a branch you'd like to order from
        </h2>
        <Select
          defaultValue={"Select a branch"}
          size="large"
          showSearch
          style={{ width: 630 }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(v) => this.setState({ selectedBranch: v })}
        >
          {admin.branches.map((branch) => (
            <Option value={branch.id}>{branch.location}</Option>
          ))}
        </Select>
        <div className="mt-4">
          <Button
            type="primary"
            size="large"
            disabled={this.state.selectedBranch === null}
            onClick={() => {
              this.props.saveSelectedBranch(this.state.selectedBranch);
              this.props.history.push("/items");
            }}
          >
            Let's go!
          </Button>
        </div>
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
    setBranches: (items) => dispatch({ type: "SET_BRANCHES", payload: items }),
    saveSelectedBranch: (branchid) =>
      dispatch({ type: "SAVE_BRANCH", payload: branchid }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
