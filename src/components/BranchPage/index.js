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
import AddWorkerModal from "./AddWorkerModal";

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
    loading: false,

    addModalOpen: false,
  };

  fetchWorkers = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_workers/");
      this.props.setWorkers(res.data.workers);
    } catch (err) {
      console.error(err);
    }
    this.setState({ loading: false });
  };

  componentDidMount = () => {
    this.fetchWorkers();
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

    const data = admin.workers.map((item) => ({ key: item.id, obj: item }));
    return (
      <div className="px-3 py-3">
        <AddWorkerModal
          visible={addItemModal}
          onClose={() => this.setState({ addItemModal: false })}
        />
        <h4>Branch workers</h4>

        <Row className="my-4">
          <Col span={6}>
            <Button
              type="primary"
              onClick={() => this.setState({ addItemModal: true })}
            >
              Add a new worker
            </Button>
          </Col>
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
            title={"Worker name"}
            key="name"
            render={(text, record) => <div>{record.obj.full_name}</div>}
          />
          <Column
            title={"Civil ID"}
            key="cid"
            render={(text, record) => <div>{record.obj.description}</div>}
          />

          <Column
            title={"Username"}
            key="username"
            render={(text, record) => <div>{record.obj.username}</div>}
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
    setWorkers: (items) => dispatch({ type: "SET_WORKERS", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
