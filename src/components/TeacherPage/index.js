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
import AddClassModal from "./AddClassModal";
import ClassDetails from "./ClassDetails";
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
    classDetailModalOpen: false,
    selectedClass: null,
  };

  fetchClasses = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.get("/fetch_classes/");
      this.props.setClasses(res.data.classes);
    } catch (err) {
      console.error(err);
    }
    this.setState({ loading: false });
  };

  componentDidMount = () => {
    this.fetchClasses();
  };

  saveName = async (id, value) => {
    try {
      const res = await instance.post("/save_name/", {
        id,
        value,
      });
      this.props.setClasses(res.data.classes);
      message.success("Edited successfully");
    } catch (err) {
      console.error(err);
    }
  };
  saveDescription = async (id, value) => {
    try {
      const res = await instance.post("/save_description/", {
        id,
        value,
      });
      this.props.setClasses(res.data.classes);
      message.success("Edited successfully");
    } catch (err) {
      console.error(err);
    }
  };

  delete = async (id) => {
    try {
      const res = await instance.post("/delete_class/", {
        id,
      });
      this.props.setClasses(res.data.classes);
      message.success("Deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };
  render() {
    const {
      loading,
      addItemModal,
      classDetailModalOpen,
      selectedClass,
    } = this.state;
    const { admin } = this.props;

    if (loading) {
      return (
        <div className="my-5 text-center">
          <Spin indicator={antIcon} />
        </div>
      );
    }

    const data = admin.classes.map((item) => ({ key: item.id, obj: item }));
    return (
      <div className="px-3 py-3">
        <AddClassModal
          visible={addItemModal}
          onClose={() => this.setState({ addItemModal: false })}
        />

        {selectedClass && (
          <ClassDetails
            visible={classDetailModalOpen}
            selectedClass={selectedClass}
            onClose={() =>
              this.setState({
                classDetailModalOpen: false,
                selectedClass: null,
              })
            }
          />
        )}
        <h4>My classes</h4>

        <Row className="my-4">
          <Col span={6}>
            <Button
              type="primary"
              onClick={() => this.setState({ addItemModal: true })}
            >
              Add a new class
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
          scroll={{ x: 500 }}
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
            title={"Name"}
            key="name"
            render={(text, record) => <div>{record.obj.name}</div>}
            onCell={(record) => {
              return {
                style: { textAlign: "center" },
                record,
                string: true,
                editable: true,
                handleSave: (id, newName) => {
                  if (newName != record.obj.name && newName !== "") {
                    this.saveName(record.obj.id, newName);
                  }
                },
                initialValue: record.obj.name,
              };
            }}
            onHeaderCell={() => {
              return {
                style: { textAlign: "center" },
              };
            }}
          />
          <Column
            title={"Description"}
            key="desc"
            render={(text, record) => <div>{record.obj.description}</div>}
            onCell={(record) => {
              return {
                style: { textAlign: "center" },
                record,
                string: true,
                editable: true,
                handleSave: (id, newDesc) => {
                  if (newDesc != record.obj.description && newDesc !== "") {
                    this.saveDescription(record.obj.id, newDesc);
                  }
                },
                initialValue: record.obj.description,
              };
            }}
            onHeaderCell={() => {
              return {
                style: { textAlign: "center" },
              };
            }}
          />

          <Column
            onHeaderCell={() => {
              return {
                style: { textAlign: "center" },
              };
            }}
            title={"Delete"}
            key="delete"
            render={(text, record) => (
              <div className="text-center">
                <Button
                  className="mx-1"
                  danger={true}
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => this.delete(record.obj.id)}
                ></Button>
              </div>
            )}
          />

          <Column
            onHeaderCell={() => {
              return {
                style: { textAlign: "center" },
              };
            }}
            title={"Details"}
            key="details"
            render={(text, record) => (
              <div className="text-center">
                <Button
                  className="mx-1"
                  type="link"
                  onClick={() =>
                    this.setState({
                      classDetailModalOpen: true,
                      selectedClass: record.obj,
                    })
                  }
                >
                  Details
                </Button>
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
    setClasses: (items) => dispatch({ type: "SET_CLASSES", payload: items }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
